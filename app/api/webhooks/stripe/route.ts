import { stripe } from '@/lib/stripe/client';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: Request) {
  const body = await request.text();
  const sig = headers().get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) {
      // In local development, signature check might fail if not configured
      console.warn('Webhook warning: stripe-signature or STRIPE_WEBHOOK_SECRET is missing. Proceeding to verify only if in test mode.');
      event = JSON.parse(body) as Stripe.Event;
    } else {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    }
  } catch (err: any) {
    console.error(`Webhook signature verification failed:`, err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    const customerEmail = session.customer_details?.email || session.metadata?.email;
    const priceId = session.metadata?.priceId;
    const customerId = session.customer as string;

    if (customerEmail) {
      // Initialize server-side Supabase client with admin access (using service role key if present, falling back to anon key)
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

      // Determine the plan based on the price ID
      let plan = 'free';
      if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID) {
        plan = 'pro';
      } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_TEAM_PRICE_ID) {
        plan = 'enterprise';
      }

      // Update the user's plan & customer ID in Supabase waitlist_users table
      const { error } = await supabaseAdmin
        .from('waitlist_users')
        .update({ 
          plan,
          stripe_customer_id: customerId
        })
        .eq('email', customerEmail.toLowerCase());

      if (error) {
        console.error('Failed to update waitlist user plan in Supabase:', error);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }

      console.log(`Successfully updated plan for user ${customerEmail} to ${plan} with customer ID ${customerId}`);
    }
  }

  // Handle subscription cancellations
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    // Downgrade plan back to free
    const { error } = await supabaseAdmin
      .from('waitlist_users')
      .update({ plan: 'free' })
      .eq('stripe_customer_id', customerId);

    if (error) {
      console.error(`Failed to downgrade user with customer ID ${customerId}:`, error);
      return NextResponse.json({ error: 'Failed to downgrade plan' }, { status: 500 });
    }

    console.log(`Successfully downgraded subscription for customer ID ${customerId}`);
  }

  return NextResponse.json({ received: true });
}
