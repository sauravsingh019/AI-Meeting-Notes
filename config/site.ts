export const siteConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'AI Meeting Notes',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  adminEmails: (process.env.ADMIN_EMAILS || 'skbha@gmail.com,admin@example.com')
    .split(',')
    .map(email => email.trim().toLowerCase())
    .filter(Boolean),
};

export function isAdminEmail(email?: string): boolean {
  if (!email) return false;
  const lowerEmail = email.toLowerCase();
  if (lowerEmail === 'demo-admin@aimeetings.com') return true;
  return siteConfig.adminEmails.includes(lowerEmail);
}
