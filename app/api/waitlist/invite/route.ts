import { NextResponse } from 'next/server';
import { createClient as createServerSupabase } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { isAdminEmail } from '@/config/site';
import { sendInviteEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    // 1. Authenticate calling user & check Admin status
    const supabaseServer = createServerSupabase();
    const { data: { user } } = await supabaseServer.auth.getUser();

    if (!user || !isAdminEmail(user.email)) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    // 2. Parse payload details
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'User email is required' }, { status: 400 });
    }

    // 3. Initialize Supabase Admin client with service key privileges
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabaseAdmin = createAdminClient(supabaseUrl, supabaseKey);

    // 4. Check if waitlist user exists
    const { data: waitlistUser, error: checkError } = await supabaseAdmin
      .from('waitlist_users')
      .select('*')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (checkError || !waitlistUser) {
      return NextResponse.json({ error: 'Waitlist user not found' }, { status: 404 });
    }

    // 5. Update user status in waitlist_users
    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from('waitlist_users')
      .update({ status: 'invited' })
      .eq('email', email.toLowerCase())
      .select()
      .single();

    if (updateError) {
      console.error('Error updating waitlist user status to invited:', updateError);
      return NextResponse.json({ error: 'Failed to update waitlist user status' }, { status: 500 });
    }

    // 6. Send transactional invitation email asynchronously
    sendInviteEmail(updatedUser.email, updatedUser.name)
      .catch(err => console.error('Failed to send invitation email:', err));

    return NextResponse.json({
      success: true,
      message: `Successfully invited user ${email}`,
      data: updatedUser
    });
  } catch (err: any) {
    console.error('API error in admin waitlist invite route:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
