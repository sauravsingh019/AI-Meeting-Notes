import { createClient } from '@/lib/supabase/server';
import { createCheckoutSession } from '@/lib/stripe/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { priceId } = await request.json();
    
    if (!priceId) {
      return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await createCheckoutSession(user.id, user.email!, priceId);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
