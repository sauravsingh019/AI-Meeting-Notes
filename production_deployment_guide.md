# Production Deployment Guide

This guide contains step-by-step instructions to configure, run, and launch your waitlist SaaS kit in a production environment.

---

## 🛠️ Step 1: Database Setup (Supabase)

1. Open your [Supabase Dashboard](https://database.supabase.com/).
2. Select your project and navigate to the **SQL Editor** in the left sidebar.
3. Click **New Query**, copy the contents of the [supabase_schema.sql](file:///c:/Users/skbha/Downloads/ai-meeting-notes/supabase_schema.sql) file, paste them in, and click **Run**.
4. This adds the necessary columns for:
   * Referral virality mechanics (`referral_code`, `referred_by`, `referral_count`).
   * Queue status (`status`).
   * Stripe customer mappings (`stripe_customer_id`).

---

## 💳 Step 2: Payment Integration (Stripe)

1. Open your [Stripe Dashboard](https://dashboard.stripe.com/).
2. Create **two recurring products**:
   * **Pro Plan** (e.g., $19/month).
   * **Enterprise Plan** (e.g., custom price).
3. Copy their respective API **Price IDs** (starting with `price_...`).
4. Set up Stripe Webhooks to sync payments to database records:
   * **Local Testing:** Run the Stripe CLI to forward events:
     ```bash
     stripe listen --forward-to localhost:3000/api/webhooks/stripe
     ```
     Copy the signing secret (`whsec_...`) printed in your terminal and save it to `STRIPE_WEBHOOK_SECRET` in `.env.local`.
   * **Production:** Navigate to *Developers > Webhooks*, click *Add Endpoint*, set the URL to `https://your-domain.com/api/webhooks/stripe`, choose events `checkout.session.completed` and `customer.subscription.deleted`, and copy the signing secret.

---

## 📧 Step 3: Transactional Email Setup (Resend)

1. Sign up on [Resend](https://resend.com/).
2. Navigate to *Domains*, click *Add Domain*, and follow the DNS instructions (MX/TXT records) in your domain registrar (GoDaddy, Namecheap, etc.) to verify ownership.
3. Generate a new API Key on Resend, and save it to `RESEND_API_KEY`.
4. *Note: If this key is missing, the application automatically runs in mock mode, logging transactional email content to stdout for debugging.*

---

## 🚀 Step 4: Web Deployment (Vercel)

1. Connect your GitHub repository to [Vercel](https://vercel.com/).
2. Under **Environment Variables**, copy the key-value structures from [env.example](file:///c:/Users/skbha/Downloads/ai-meeting-notes/.env.example):
   * `NEXT_PUBLIC_SUPABASE_URL`
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   * `SUPABASE_SERVICE_ROLE_KEY`
   * `NEXT_PUBLIC_APP_URL` (Set to your custom domain, e.g., `https://my-saas-waitlist.vercel.app`)
   * `STRIPE_SECRET_KEY`
   * `STRIPE_WEBHOOK_SECRET`
   * `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID`
   * `NEXT_PUBLIC_STRIPE_TEAM_PRICE_ID`
   * `RESEND_API_KEY`
3. Click **Deploy**.
