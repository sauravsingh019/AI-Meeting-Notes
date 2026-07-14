import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: users, error } = await supabase
      .from('waitlist_users')
      .select('name, plan, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Database error fetching recent waitlist:', error);
      return NextResponse.json({ error: 'Database fetch failed' }, { status: 500 });
    }

    const now = Date.now();
    const recentSignups = (users || []).map((user: any) => {
      // 1. Anonymize name: "Steve Jobs" -> "Steve J."
      const nameParts = user.name.trim().split(/\s+/);
      const firstName = nameParts[0] || 'Someone';
      const lastInitial = nameParts.length > 1 ? ` ${nameParts[nameParts.length - 1][0].toUpperCase()}.` : '';
      const anonymizedName = `${firstName}${lastInitial}`;

      // 2. Relative time string
      const createdTime = new Date(user.created_at).getTime();
      const diffMs = now - createdTime;
      const diffMins = Math.floor(diffMs / (60 * 1000));
      const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
      const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

      let timeAgo = 'Just joined';
      if (diffMins >= 1 && diffMins < 60) {
        timeAgo = `${diffMins}m ago`;
      } else if (diffHours >= 1 && diffHours < 24) {
        timeAgo = `${diffHours}h ago`;
      } else if (diffDays >= 1) {
        timeAgo = `${diffDays}d ago`;
      }

      return {
        name: anonymizedName,
        plan: user.plan || 'free',
        timeAgo
      };
    });

    return NextResponse.json({ success: true, data: recentSignups });
  } catch (error: any) {
    console.error('Error fetching recent signups:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
