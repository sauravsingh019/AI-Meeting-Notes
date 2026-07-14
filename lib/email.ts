interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log('\n=================== [MOCK TRANSACTIONAL EMAIL] ===================');
    console.log(`To:      ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content:\n${html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()}`);
    console.log('==================================================================\n');
    return { success: true, mock: true };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: `${process.env.NEXT_PUBLIC_APP_NAME || 'AI Meeting Notes'} <onboarding@resend.dev>`,
        to: [to],
        subject: subject,
        html: html,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Resend API Error details:', errorData);
      throw new Error(errorData.message || 'Failed to send email via Resend');
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

export async function sendWelcomeEmail(toEmail: string, name: string, waitlistPosition: number, referralCode: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const referralLink = `${appUrl}/?ref=${referralCode}`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 16px;">
      <h2 style="color: #4f46e5; margin-bottom: 24px;">Welcome to the Club, ${name}! 🚀</h2>
      <p style="font-size: 16px; color: #374151; line-height: 1.6;">
        You've successfully secured your spot on the waitlist for <strong>AI Meeting Notes</strong>.
      </p>
      
      <div style="background-color: #f5f3ff; border: 1px solid #ddd6fe; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center;">
        <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #6d28d9; font-weight: bold;">Your Waitlist Spot</span>
        <h1 style="font-size: 48px; margin: 8px 0; color: #1e1b4b; font-weight: 900;">#${waitlistPosition}</h1>
      </div>

      <h3 style="color: #1f2937; margin-top: 32px;">Want to jump the queue?</h3>
      <p style="font-size: 14px; color: #4b5563; line-height: 1.6;">
        Share your unique referral link with fellow founders. For each person who registers using your link, you'll move up in line!
      </p>
      
      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; margin: 16px 0; font-family: monospace; font-size: 14px; word-break: break-all;">
        ${referralLink}
      </div>

      <p style="font-size: 12px; color: #9ca3af; margin-top: 40px; border-t: 1px solid #e5e7eb; padding-top: 20px;">
        AI Meeting Notes Team. Keep building.
      </p>
    </div>
  `;

  return sendEmail({
    to: toEmail,
    subject: `You're on the list! (Queue Spot #${waitlistPosition})`,
    html,
  });
}

export async function sendInviteEmail(toEmail: string, name: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const loginUrl = `${appUrl}/login`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 16px;">
      <h2 style="color: #4f46e5; margin-bottom: 24px;">Your spot is ready! 🎉</h2>
      <p style="font-size: 16px; color: #374151; line-height: 1.6;">
        Hi ${name},<br><br>
        Great news! We've approved your early access slot. You can now log into your dashboard portal and experience premium AI meeting insights.
      </p>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${loginUrl}" style="background-color: #4f46e5; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
          Access the Dashboard
        </a>
      </div>

      <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
        If the button above does not work, copy and paste the following URL into your browser:
      </p>
      <p style="font-size: 12px; color: #4b5563; word-break: break-all;">
        ${loginUrl}
      </p>

      <p style="font-size: 12px; color: #9ca3af; margin-top: 40px; border-t: 1px solid #e5e7eb; padding-top: 20px;">
        AI Meeting Notes Team.
      </p>
    </div>
  `;

  return sendEmail({
    to: toEmail,
    subject: "You've been invited! AI Meeting Notes Early Access",
    html,
  });
}

export async function sendReferralAlertEmail(toEmail: string, referrerName: string, referralCount: number) {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 16px;">
      <h2 style="color: #10b981; margin-bottom: 24px;">Someone joined via your link! 🚀</h2>
      <p style="font-size: 16px; color: #374151; line-height: 1.6;">
        Hi ${referrerName},<br><br>
        Awesome job sharing! A new founder just signed up using your referral link.
      </p>

      <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center;">
        <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #047857; font-weight: bold;">Total Referrals</span>
        <h1 style="font-size: 40px; margin: 8px 0; color: #064e3b; font-weight: 900;">${referralCount}</h1>
      </div>

      <p style="font-size: 14px; color: #4b5563; line-height: 1.6;">
        Your waitlist rank has automatically been improved. Keep sharing your link to climb even higher!
      </p>

      <p style="font-size: 12px; color: #9ca3af; margin-top: 40px; border-t: 1px solid #e5e7eb; padding-top: 20px;">
        AI Meeting Notes Team.
      </p>
    </div>
  `;

  return sendEmail({
    to: toEmail,
    subject: "New referral confirmed! 🚀",
    html,
  });
}
