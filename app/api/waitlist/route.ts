import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { waitlistSchema } from '@/utils/validators';
import { sendWelcomeEmail, sendReferralAlertEmail } from '@/lib/email';
import { isRateLimited } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    const rawIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    const ip = rawIp.split(',')[0].trim();

    // 1. IP Rate Limiter (Limit 3 registrations per IP per hour)
    if (isRateLimited(ip)) {
      return NextResponse.json({ 
        error: 'Too many registrations from this IP address. Please try again in an hour.' 
      }, { status: 429 });
    }

    const body = await request.json();

    // 2. Bot Decoy Honeypot Check
    if (body.honeypot) {
      console.warn('Bot signup detected via honeypot field. Returning decoy success.');
      return NextResponse.json({
        success: true,
        message: 'Successfully registered',
        data: {
          id: 'decoy-' + Math.random().toString(36).substring(2, 9),
          name: body.name || 'Founder',
          email: body.email || 'decoy@example.com',
          plan: body.plan || 'free',
          referral_code: 'decoyref',
          waitlist_position: 404
        }
      });
    }
    
    // Validate input data
    const validation = waitlistSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ 
        error: validation.error.errors[0]?.message || 'Invalid input data' 
      }, { status: 400 });
    }

    const { name, email, plan, referredBy } = body;

    // 3. Block disposable email providers
    const disposableDomains = ['mailinator.com', 'yopmail.com', 'tempmail.com', 'trashmail.com', '10minutemail.com'];
    const emailDomain = email?.toLowerCase().split('@')[1];
    if (emailDomain && disposableDomains.includes(emailDomain)) {
      return NextResponse.json({
        error: 'Temporary/disposable email addresses are not allowed.'
      }, { status: 400 });
    }

    // Initialize server-side Supabase client with admin access
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if email already exists in the waitlist
    const { data: existingUser, error: checkError } = await supabase
      .from('waitlist_users')
      .select('*')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (checkError) {
      console.error('Database error checking user existence:', checkError);
      return NextResponse.json({ error: 'Database check failed' }, { status: 500 });
    }

    if (existingUser) {
      // Get position for the existing user
      const { count: position } = await supabase
        .from('waitlist_users')
        .select('*', { count: 'exact', head: true })
        .lte('created_at', existingUser.created_at);

      return NextResponse.json({
        success: true,
        message: 'Already on the waitlist',
        data: {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          plan: existingUser.plan,
          referral_code: existingUser.referral_code || '',
          waitlist_position: (position || 0) + 1
        }
      });
    }

    // Generate unique referral code
    const referralCode = Math.random().toString(36).substring(2, 10).toLowerCase();

    // Verify and handle referredBy code if present
    let finalReferredBy: string | null = null;
    let referrerRecord: any = null;
    if (referredBy) {
      const { data: referrer, error: referrerError } = await supabase
        .from('waitlist_users')
        .select('*')
        .eq('referral_code', referredBy.toLowerCase())
        .maybeSingle();

      if (!referrerError && referrer) {
        finalReferredBy = referrer.referral_code;
        referrerRecord = referrer;

        // Increment referrer count
        await supabase
          .from('waitlist_users')
          .update({ referral_count: (referrer.referral_count || 0) + 1 })
          .eq('id', referrer.id);
      }
    }

    // Insert new waitlist user
    const { data: newUser, error: insertError } = await supabase
      .from('waitlist_users')
      .insert([
        {
          name,
          email: email.toLowerCase(),
          plan,
          referral_code: referralCode,
          referred_by: finalReferredBy,
          referral_count: 0,
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Failed to insert waitlist user:', insertError);
      return NextResponse.json({ error: 'Failed to register on waitlist' }, { status: 500 });
    }

    // Get total signups up to now to find their position
    const { count: position } = await supabase
      .from('waitlist_users')
      .select('*', { count: 'exact', head: true })
      .lte('created_at', newUser.created_at);

    const actualPosition = position || 1;

    // Trigger emails asynchronously
    sendWelcomeEmail(newUser.email, newUser.name, actualPosition, newUser.referral_code)
      .catch(err => console.error('Welcome email failed to send:', err));

    if (referrerRecord) {
      sendReferralAlertEmail(referrerRecord.email, referrerRecord.name, (referrerRecord.referral_count || 0) + 1)
        .catch(err => console.error('Referral alert email failed to send:', err));
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully registered',
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        plan: newUser.plan,
        referral_code: newUser.referral_code,
        waitlist_position: actualPosition
      }
    });
  } catch (err: any) {
    console.error('API Error in waitlist signup:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
