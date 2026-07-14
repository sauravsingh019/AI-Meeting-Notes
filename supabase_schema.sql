-- Consolidated Supabase Schema Migrations for AI Meeting Notes Launch Kit

-- 1. Add Referral Fields
ALTER TABLE waitlist_users ADD COLUMN IF NOT EXISTS referral_code VARCHAR(50) UNIQUE;
ALTER TABLE waitlist_users ADD COLUMN IF NOT EXISTS referred_by VARCHAR(50);
ALTER TABLE waitlist_users ADD COLUMN IF NOT EXISTS referral_count INTEGER DEFAULT 0;

-- Backfill referral codes for any existing users
UPDATE waitlist_users 
SET referral_code = substr(md5(random()::text), 1, 8) 
WHERE referral_code IS NULL;

-- 2. Add Waitlist Status Field
ALTER TABLE waitlist_users ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending';

-- 3. Add Stripe Customer Billing Identifier
ALTER TABLE waitlist_users ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(100);
