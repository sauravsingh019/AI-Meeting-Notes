import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe/client';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const demoMode = cookieStore.get('demo_mode')?.value;

    if (demoMode === 'user' || demoMode === 'admin') {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      return NextResponse.json({ url: `${appUrl}/profile?demo_portal=success` });
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch the waitlist user record to check for stripe_customer_id
    const { data: waitlistUser, error: dbError } = await supabase
      .from('waitlist_users')
      .select('stripe_customer_id')
      .eq('email', user.email?.toLowerCase())
      .maybeSingle();

    if (dbError) {
      console.error('Database error fetching customer ID:', dbError);
      return NextResponse.json({ error: 'Database check failed' }, { status: 500 });
    }

    if (!waitlistUser || !waitlistUser.stripe_customer_id) {
      return NextResponse.json({ 
        error: 'No active Stripe billing profile found. Please subscribe to a paid plan first.' 
      }, { status: 400 });
    }

    // Create the billing portal session
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: waitlistUser.stripe_customer_id,
      return_url: `${appUrl}/profile`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error: any) {
    console.error('Error creating Stripe billing portal session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
