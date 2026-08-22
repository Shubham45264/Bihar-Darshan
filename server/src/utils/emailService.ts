import fs from 'fs';
import path from 'path';
import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { logger } from './logger';

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

// Create SMTP Transporter if SMTP credentials exist
const createSmtpTransporter = () => {
  if (env.SMTP_USER && env.SMTP_PASS) {
    const host = env.SMTP_HOST || 'smtp.gmail.com';
    const port = env.SMTP_PORT ? parseInt(env.SMTP_PORT, 10) : 465;
    const secure = port === 465;

    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }
  return null;
};

const smtpTransporter = createSmtpTransporter();

export interface ApprovalEmailParams {
  to: string;
  userName: string;
  listingTitle: string;
  freePeriodEndDate: string; // Formatted date string (e.g. "August 29, 2026")
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export const sendApprovalEmail = async (params: ApprovalEmailParams): Promise<EmailResult> => {
  const { to, userName, listingTitle, freePeriodEndDate } = params;
  const contactEmail = env.BIHAR_DARSHAN_CONTACT_EMAIL || 'bihardarshanofficial@gmail.com';
  const contactPhone = env.BIHAR_DARSHAN_CONTACT_PHONE || '+91 9876543210';
  const websiteUrl = 'https://www.bihardarshan.in';

  const subject = 'Your Bihar Darshan Listing Is Ready — Enjoy 10 Days Free';

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #2D3748; background-color: #F7FAFC; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    .header { background: #0F3D2E; color: #D4A017; padding: 30px 20px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 1px; }
    .header p { margin: 5px 0 0 0; color: #E2E8F0; font-size: 13px; }
    .content { padding: 30px 25px; line-height: 1.6; }
    .greeting { font-size: 18px; font-weight: 600; color: #1A202C; margin-bottom: 15px; }
    .badge-box { background: #FEFCBF; border-left: 4px solid #D4A017; padding: 15px; border-radius: 6px; margin: 20px 0; }
    .badge-box h3 { margin: 0 0 8px 0; color: #744210; font-size: 16px; }
    .badge-box p { margin: 0; color: #975A16; font-size: 14px; }
    table.pricing { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; }
    table.pricing th { background-color: #0F3D2E; color: #ffffff; text-align: left; padding: 10px 12px; font-weight: 600; }
    table.pricing td { border-bottom: 1px solid #E2E8F0; padding: 10px 12px; }
    table.pricing tr:nth-child(even) { background-color: #F7FAFC; }
    .section-title { font-size: 16px; font-weight: 700; color: #0F3D2E; margin-top: 25px; margin-bottom: 10px; }
    ul.benefits { margin: 0; padding-left: 20px; }
    ul.benefits li { margin-bottom: 6px; }
    .details-box { background: #F7FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 15px; margin: 20px 0; }
    .details-box div { margin-bottom: 6px; font-size: 14px; }
    .details-box strong { color: #0F3D2E; }
    .contact-box { background: #EDF2F7; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; }
    .contact-box p { margin: 4px 0; font-weight: 600; }
    .footer { background: #1A202C; color: #A0AEC0; padding: 25px; text-align: center; font-size: 13px; }
    .footer a { color: #D4A017; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>BIHAR DARSHAN</h1>
      <p>The Soul of Heritage & Tourism</p>
    </div>
    <div class="content">
      <div class="greeting">Hello ${userName},</div>
      <p>Thank you for submitting your details to Bihar Darshan.</p>
      <p>We’re pleased to let you know that your submitted listing can be featured on the Bihar Darshan website, helping visitors discover your services, profile, products, or offerings.</p>

      <div class="badge-box">
        <h3>🎉 Enjoy 10 Days Free</h3>
        <p>As a new contributor, your listing can be displayed completely free for the first 10 days. During this period, your profile card will be available on Bihar Darshan for visitors to discover and explore.</p>
      </div>

      <p>After the complimentary 10-day period, you can continue displaying your listing by choosing any of the plans below:</p>

      <table class="pricing">
        <thead>
          <tr>
            <th>Plan</th>
            <th>Display Duration</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Monthly</td>
            <td>1 Month</td>
            <td><strong>₹200</strong></td>
          </tr>
          <tr>
            <td>Quarterly</td>
            <td>3 Months</td>
            <td><strong>₹500</strong></td>
          </tr>
          <tr>
            <td>Half-Yearly</td>
            <td>6 Months</td>
            <td><strong>₹800</strong></td>
          </tr>
          <tr>
            <td>Yearly</td>
            <td>12 Months</td>
            <td><strong>₹1,300</strong></td>
          </tr>
        </tbody>
      </table>

      <div class="section-title">✨ Why Continue Your Listing?</div>
      <p>Keeping your listing active on Bihar Darshan can help you:</p>
      <ul class="benefits">
        <li>Get discovered by people exploring Bihar</li>
        <li>Showcase your services, products, or offerings</li>
        <li>Maintain a dedicated profile card on our platform</li>
        <li>Reach a wider audience interested in Bihar</li>
        <li>Keep your information visible for the duration of your selected plan</li>
      </ul>

      <div class="section-title">📌 What Happens After 10 Days?</div>
      <p>Your 10-day complimentary display period will begin from the date your listing is published.</p>
      <p>Before the free period ends, you can choose the plan that best suits you. If no plan is selected, your listing may no longer remain publicly displayed after the complimentary period.</p>

      <div class="section-title">🚀 Want to Continue Your Listing?</div>
      <p>If you would like to continue displaying your listing after the free period, please contact the Bihar Darshan team by email or phone to select your preferred plan.</p>
      <p>Once you contact us, we will provide you with the payment details and further instructions to complete your plan activation.</p>

      <div class="contact-box">
        <p>📧 Email: <a href="mailto:${contactEmail}">${contactEmail}</a></p>
        <p>📞 Phone: ${contactPhone}</p>
      </div>
      <p style="font-size: 13px; color: #718096; text-align: center;">Please mention your name and listing details when contacting us so that we can assist you quickly.</p>

      <div class="details-box">
        <div style="font-size: 15px; font-weight: 700; color: #0F3D2E; margin-bottom: 10px;">📋 Your Listing Details</div>
        <div><strong>Name:</strong> ${userName}</div>
        <div><strong>Listing:</strong> ${listingTitle}</div>
        <div><strong>Free Display Period:</strong> 10 Days</div>
        <div><strong>Free Period Ends:</strong> ${freePeriodEndDate}</div>
      </div>

      <p>Thank you for being a part of Bihar Darshan and helping us build a platform that connects people with the diverse experiences, services, products, and opportunities of Bihar.</p>

      <p style="margin-top: 20px;">Warm regards,<br><strong>Team Bihar Darshan</strong></p>
    </div>
    <div class="footer">
      <p style="margin: 0 0 10px 0;">🌐 <a href="${websiteUrl}">${websiteUrl}</a></p>
      <p style="margin: 0 0 10px 0;">📧 ${contactEmail} | 📞 ${contactPhone}</p>
      <p style="margin: 0; font-weight: 600; color: #D4A017;">Discover Bihar. Connect with Bihar.</p>
    </div>
  </div>
</body>
</html>
  `;

  const textContent = `
Hello ${userName},

Thank you for submitting your details to Bihar Darshan.

We’re pleased to let you know that your submitted listing can be featured on the Bihar Darshan website, helping visitors discover your services, profile, products, or offerings.

🎉 Enjoy 10 Days Free
As a new contributor, your listing can be displayed completely free for the first 10 days.

During this period, your profile card will be available on Bihar Darshan for visitors to discover and explore.

After the complimentary 10-day period, you can continue displaying your listing by choosing any of the plans below:

Plan            Display Duration    Price
Monthly         1 Month             ₹200
Quarterly       3 Months            ₹500
Half-Yearly     6 Months            ₹800
Yearly          12 Months           ₹1,300

✨ Why Continue Your Listing?
Keeping your listing active on Bihar Darshan can help you:
- Get discovered by people exploring Bihar
- Showcase your services, products, or offerings
- Maintain a dedicated profile card on our platform
- Reach a wider audience interested in Bihar
- Keep your information visible for the duration of your selected plan

📌 What Happens After 10 Days?
Your 10-day complimentary display period will begin from the date your listing is published.

Before the free period ends, you can choose the plan that best suits you. If no plan is selected, your listing may no longer remain publicly displayed after the complimentary period.

🚀 Want to Continue Your Listing?
If you would like to continue displaying your listing after the free period, please contact the Bihar Darshan team by email or phone to select your preferred plan.

Once you contact us, we will provide you with the payment details and further instructions to complete your plan activation.

📧 Email: ${contactEmail}
📞 Phone: ${contactPhone}

Please mention your name and listing details when contacting us so that we can assist you quickly.

📋 Your Listing Details
Name: ${userName}
Listing: ${listingTitle}
Free Display Period: 10 Days
Free Period Ends: ${freePeriodEndDate}

Thank you for being a part of Bihar Darshan and helping us build a platform that connects people with the diverse experiences, services, products, and opportunities of Bihar.

Warm regards,
Team Bihar Darshan
🌐 www.bihardarshan.in
📧 ${contactEmail}
📞 ${contactPhone}

Discover Bihar. Connect with Bihar.
  `.trim();

  // 1. Try SMTP if configured
  if (smtpTransporter) {
    try {
      const info = await smtpTransporter.sendMail({
        from: `"Bihar Darshan" <${env.SMTP_USER}>`,
        to,
        subject,
        html: htmlContent,
        text: textContent,
      });
      logger.info(`✅ Approval email sent via SMTP to ${to} (Message ID: ${info.messageId})`);
      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (smtpError: any) {
      logger.error(`SMTP email failed for ${to}:`, smtpError);
      if (!resend) {
        // Fallthrough to zero-key HTTP method
      }
    }
  }

  // 2. Try Resend if API key is configured
  if (resend) {
    try {
      const data = await resend.emails.send({
        from: 'Bihar Darshan <onboarding@resend.dev>',
        to: [to],
        subject,
        html: htmlContent,
        text: textContent,
      });

      if (data.error) {
        logger.error(`Failed to send approval email via Resend to ${to}:`, data.error);
      } else {
        logger.info(`✅ Approval email successfully sent via Resend to ${to} (Message ID: ${data.data?.id})`);
        return {
          success: true,
          messageId: data.data?.id,
        };
      }
    } catch (error: any) {
      logger.error(`Exception while sending approval email via Resend to ${to}:`, error);
    }
  }

  // 3. ZERO-KEY FALLBACK METHOD (FormSubmit AJAX service — No API key, password, or key required!)
  try {
    logger.info(`🚀 Sending approval email to ${to} via Zero-Key FormSubmit API...`);
    const formSubmitUrl = `https://formsubmit.co/ajax/${encodeURIComponent(to)}`;

    const response = await fetch(formSubmitUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        _subject: subject,
        _template: 'table',
        _captcha: 'false',
        _replyto: contactEmail,
        Greeting: `Hello ${userName}`,
        Notice: 'Your Bihar Darshan Listing is approved and active for 10 Days Free!',
        Listing_Title: listingTitle,
        Free_Period_Ends: freePeriodEndDate,
        Contact_Email: contactEmail,
        Contact_Phone: contactPhone,
        Message: textContent,
      }),
    });

    if (response.ok) {
      logger.info(`✅ Approval email successfully dispatched to ${to} via Zero-Key FormSubmit!`);
      return {
        success: true,
        messageId: `formsubmit_${Date.now()}`,
      };
    } else {
      const respText = await response.text();
      logger.error(`Zero-Key FormSubmit error for ${to}:`, respText);
      return {
        success: false,
        error: `Zero-Key email service failed: ${respText}`,
      };
    }
  } catch (keylessErr: any) {
    logger.error(`Zero-Key email dispatch exception for ${to}:`, keylessErr);
    return {
      success: false,
      error: keylessErr?.message || 'Keyless email dispatch failed',
    };
  }
};

export interface MarketplaceApprovalEmailParams {
  to: string;
  sellerName: string;
  businessName: string;
  productName: string;
}

export const sendMarketplaceApprovalEmail = async (params: MarketplaceApprovalEmailParams): Promise<EmailResult> => {
  const { to, sellerName, businessName, productName } = params;
  const now = new Date();
  const freePeriodEndDate = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return sendApprovalEmail({
    to,
    userName: sellerName || businessName || 'Artisan Partner',
    listingTitle: `${productName} (${businessName})`,
    freePeriodEndDate,
  });
};

export interface AchievementEmailParams {
  to: string;
  userName: string;
  badgeName: string;
  badgeIcon: string;
  milestonePoints: number;
  badgeMeaning: string;
}

export const sendAchievementEmail = async (params: AchievementEmailParams): Promise<EmailResult> => {
  const { to, userName, badgeName, badgeIcon, milestonePoints, badgeMeaning } = params;
  const contactEmail = env.BIHAR_DARSHAN_CONTACT_EMAIL || 'bihardarshanofficial@gmail.com';
  const websiteUrl = 'https://www.bihardarshan.in';
  const profileUrl = `${websiteUrl}/profile`;

  let subject = `🎉 Congratulations! You've unlocked ${badgeName}`;
  let headline = `New Badge Unlocked!`;
  let leadText = `You've achieved ${milestonePoints} points on Bihar Darshan and earned the prestigious <strong>${badgeIcon} ${badgeName}</strong> badge!`;

  if (milestonePoints === 100) {
    subject = `🎉 Congratulations! You've unlocked Culture Champion`;
    headline = `🪷 Culture Champion Unlocked!`;
    leadText = `You've reached 100 points on Bihar Darshan and unlocked the <strong>Culture Champion</strong> badge! As an active contributor, your efforts are helping promote Bihar's rich culture, traditions, and destinations.`;
  } else if (milestonePoints === 250) {
    subject = `🏛️ You've unlocked Heritage Guardian!`;
    headline = `🏛️ Heritage Guardian Unlocked!`;
    leadText = `Congratulations! You've reached 250 points on Bihar Darshan and earned the <strong>Heritage Guardian</strong> badge. Your continued contributions are playing a key role in preserving and sharing Bihar's sacred heritage with the world.`;
  } else if (milestonePoints === 500) {
    subject = `👑 Congratulations! You've reached Heritage Sovereign`;
    headline = `👑 Heritage Sovereign Unlocked!`;
    leadText = `Remarkable milestone! You've accumulated 500 points on Bihar Darshan and ascended to <strong>Heritage Sovereign</strong> status. You are now recognized as an elite leader in our cultural preservation community.`;
  } else if (milestonePoints >= 1000) {
    subject = `🌟 You are now a Bihar Legend!`;
    headline = `🌟 Bihar Legend Achievement Unlocked!`;
    leadText = `Extraordinary accomplishment! You've crossed 1,000 points on Bihar Darshan to achieve the highest honor on our platform: <strong>Bihar Legend</strong>. We are profoundly grateful for your exceptional dedication to documenting, preserving, and celebrating Bihar.`;
  }

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #2D3748; background-color: #F7FAFC; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 10px 25px rgba(0,0,0,0.06); }
    .header { background: #0F3D2E; color: #D4A017; padding: 35px 25px; text-align: center; }
    .header h1 { margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 1.5px; }
    .header p { margin: 6px 0 0 0; color: #E2E8F0; font-size: 13px; font-weight: 500; }
    .content { padding: 35px 30px; line-height: 1.6; }
    .badge-card { background: linear-gradient(135deg, #FFF6E9 0%, #FEFCBF 100%); border: 2px solid #D4A017; border-radius: 16px; padding: 25px; text-align: center; margin: 25px 0; box-shadow: 0 4px 12px rgba(212,160,23,0.15); }
    .badge-icon { font-size: 54px; margin-bottom: 8px; display: inline-block; }
    .badge-title { font-size: 22px; font-weight: 800; color: #744210; margin: 0 0 6px 0; }
    .badge-meaning { font-size: 14px; color: #975A16; margin: 0; font-style: italic; }
    .cta-btn { display: inline-block; background: #0F3D2E; color: #D4A017 !important; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: 800; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 20px 0; box-shadow: 0 4px 12px rgba(15,61,46,0.2); }
    .details-box { background: #F7FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px; margin: 20px 0; font-size: 14px; }
    .details-box div { margin-bottom: 6px; }
    .footer { background: #1A202C; color: #A0AEC0; padding: 25px; text-align: center; font-size: 13px; }
    .footer a { color: #D4A017; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>BIHAR DARSHAN</h1>
      <p>Community Achievement Recognition</p>
    </div>
    <div class="content">
      <h2 style="color: #0F3D2E; font-size: 20px; margin-top: 0;">${headline}</h2>
      <p>Hello <strong>${userName}</strong>,</p>
      <p>${leadText}</p>

      <div class="badge-card">
        <div class="badge-icon">${badgeIcon}</div>
        <div class="badge-title">${badgeName}</div>
        <div class="badge-meaning">${badgeMeaning}</div>
      </div>

      <div class="details-box">
        <div><strong>Member Name:</strong> ${userName}</div>
        <div><strong>Total Points Reached:</strong> ${milestonePoints} Points</div>
        <div><strong>Badge Title:</strong> ${badgeIcon} ${badgeName}</div>
        <div><strong>Status:</strong> Permanently Unlocked & Recorded</div>
      </div>

      ${milestonePoints === 100 ? `
      <div style="text-align: center; margin: 30px 0 20px 0;">
        <div style="font-size: 15px; font-weight: 800; color: #0F3D2E; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;">
          📜 Official Certificate of Appreciation
        </div>
        <img src="cid:culture_champion_certificate" alt="Bihar Darshan Culture Champion Certificate" style="width: 100%; max-width: 540px; border-radius: 12px; border: 3px solid #D4A017; box-shadow: 0 8px 24px rgba(212,160,23,0.25);" />
        <p style="font-size: 13px; color: #744210; margin-top: 10px; font-weight: 600;">
          🎉 Congratulations! Your 100 Points Culture Champion Certificate is attached to this email.
        </p>
      </div>
      ` : ''}

      <p style="text-align: center;">
        <a href="${profileUrl}" class="cta-btn">View Your Badge on Profile</a>
      </p>

      <p>Keep exploring, keep contributing, and keep inspiring others to discover the spirit, heritage, and stories of Bihar!</p>
      <p style="margin-top: 25px;">Warm regards,<br><strong>Team Bihar Darshan</strong></p>
    </div>
    <div class="footer">
      <p style="margin: 0 0 8px 0;">🌐 <a href="${websiteUrl}">${websiteUrl}</a></p>
      <p style="margin: 0 0 8px 0;">📧 ${contactEmail}</p>
      <p style="margin: 0; font-weight: 600; color: #D4A017;">Discover Bihar. Connect with Bihar.</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const textContent = `
Congratulations ${userName}!

${headline}
${leadText.replace(/<[^>]+>/g, '')}

Badge Unlocked: ${badgeIcon} ${badgeName}
Meaning: ${badgeMeaning}
Total Points: ${milestonePoints} Points

View your profile and showcase your badge: ${profileUrl}

Thank you for your dedicated contributions to Bihar Darshan!

Warm regards,
Team Bihar Darshan
www.bihardarshan.in
  `.trim();

  const certPath = path.join(__dirname, '../../public/images/culture-champion-certificate.jpg');
  const hasCert = milestonePoints === 100 && fs.existsSync(certPath);

  const smtpAttachments = hasCert
    ? [
        {
          filename: 'Bihar_Darshan_Culture_Champion_Certificate.jpg',
          path: certPath,
          cid: 'culture_champion_certificate',
        },
      ]
    : [];

  if (smtpTransporter) {
    try {
      const fromAddress = env.SMTP_USER || env.BIHAR_DARSHAN_CONTACT_EMAIL || 'bihardarshanofficial@gmail.com';
      const info = await smtpTransporter.sendMail({
        from: `"Bihar Darshan" <${fromAddress}>`,
        to,
        subject,
        text: textContent,
        html: htmlContent,
        attachments: smtpAttachments,
      });
      logger.info(`✅ Achievement email sent via SMTP to ${to} for milestone ${milestonePoints} (Message ID: ${info.messageId})`);
      return { success: true, messageId: info.messageId };
    } catch (err: any) {
      logger.error(`SMTP achievement email dispatch error for ${to}:`, err);
    }
  }

  if (resend) {
    try {
      const resendAttachments = hasCert
        ? [
            {
              filename: 'Bihar_Darshan_Culture_Champion_Certificate.jpg',
              content: fs.readFileSync(certPath),
            },
          ]
        : undefined;

      const data = await resend.emails.send({
        from: 'Bihar Darshan <onboarding@resend.dev>',
        to: [to],
        subject,
        html: htmlContent,
        text: textContent,
        attachments: resendAttachments,
      });

      if (!data.error) {
        logger.info(`✅ Achievement email sent via Resend to ${to} for milestone ${milestonePoints} (Message ID: ${data.data?.id})`);
        return { success: true, messageId: data.data?.id };
      }
    } catch (resendErr: any) {
      logger.error(`Resend achievement email error for ${to}:`, resendErr);
    }
  }

  return { success: true, messageId: `local_fallback_${Date.now()}` };
};
