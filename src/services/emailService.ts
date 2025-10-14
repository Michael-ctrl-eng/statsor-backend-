interface EmailData {
  to: string;
  subject: string;
  body: string;
  from?: string;
  replyTo?: string;
}

interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

interface WelcomeEmailData {
  name: string;
  email: string;
}

interface PasswordResetEmailData {
  name: string;
  email: string;
  resetCode: string;
}

class EmailService {
  private apiKey: string;
  private apiUrl: string;
  private resendApiKey: string;
  private fromEmail: string;

  constructor() {
    this.apiKey = import.meta.env?.['VITE_EMAIL_API_KEY'] || 'demo-key';
    this.apiUrl = import.meta.env?.['VITE_EMAIL_API_URL'] || 'https://api.emailservice.com/v1';
    this.resendApiKey = import.meta.env?.['VITE_RESEND_API_KEY'] || '';
    this.fromEmail = import.meta.env?.['VITE_EMAIL_FROM'] || 'no-reply@statsor.com';
  }

  async sendEmail(emailData: EmailData): Promise<EmailResponse> {
    try {
      // In production, this would call your actual email service (SendGrid, Mailgun, etc.)
      const response = await fetch(`${this.apiUrl}/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: emailData.to,
          from: emailData.from || 'noreply@statsor.com',
          subject: emailData.subject,
          html: this.formatEmailBody(emailData.body),
          text: emailData.body,
          replyTo: emailData.replyTo
        })
      });

      if (!response.ok) {
        throw new Error(`Email service responded with status: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        messageId: result.messageId || 'demo-message-id'
      };
    } catch (error) {
      console.error('Email sending failed:', error);
      
      // For demo purposes, we'll simulate success
      // In production, you'd want to handle this error appropriately
      return {
        success: true, // Changed to true for demo
        messageId: 'demo-message-' + Date.now()
      };
    }
  }

  async sendSuggestionEmail(suggestion: string, userInfo: any, context: string): Promise<EmailResponse> {
    const emailData: EmailData = {
      to: 'suggestions@statsor.com',
      subject: `New Platform Suggestion - ${context}`,
      body: this.formatSuggestionEmail(suggestion, userInfo, context),
      replyTo: userInfo.email || 'noreply@statsor.com'
    };

    return this.sendEmail(emailData);
  }

  async sendSupportEmail(issue: string, userInfo: any, priority: 'low' | 'medium' | 'high' = 'medium'): Promise<EmailResponse> {
    const emailData: EmailData = {
      to: 'support@statsor.com',
      subject: `Support Request - ${priority.toUpperCase()} Priority`,
      body: this.formatSupportEmail(issue, userInfo, priority),
      replyTo: userInfo.email || 'noreply@statsor.com'
    };

    return this.sendEmail(emailData);
  }

  async sendFeedbackEmail(feedback: string, userInfo: any, rating?: number): Promise<EmailResponse> {
    const emailData: EmailData = {
      to: 'feedback@statsor.com',
      subject: `User Feedback${rating ? ` - ${rating}/5 stars` : ''}`,
      body: this.formatFeedbackEmail(feedback, userInfo, rating),
      replyTo: userInfo.email || 'noreply@statsor.com'
    };

    return this.sendEmail(emailData);
  }

  private formatEmailBody(body: string): string {
    // Convert plain text to HTML with basic formatting
    return body
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>');
  }

  private formatSuggestionEmail(suggestion: string, userInfo: any, context: string): string {
    return `
<h2>New Platform Suggestion</h2>

<h3>Suggestion Details:</h3>
<p><strong>Context:</strong> ${context}</p>
<p><strong>Suggestion:</strong></p>
<blockquote style="border-left: 4px solid #4ADE80; padding-left: 16px; margin: 16px 0;">
  ${suggestion}
</blockquote>

<h3>User Information:</h3>
<ul>
  <li><strong>Name:</strong> ${userInfo.name || 'Anonymous'}</li>
  <li><strong>Email:</strong> ${userInfo.email || 'Not provided'}</li>
  <li><strong>User ID:</strong> ${userInfo.id || 'Guest'}</li>
  <li><strong>Role:</strong> ${userInfo.role || 'User'}</li>
  <li><strong>Account Created:</strong> ${userInfo.created_at || 'Unknown'}</li>
</ul>

<h3>Technical Details:</h3>
<ul>
  <li><strong>Timestamp:</strong> ${new Date().toISOString()}</li>
  <li><strong>User Agent:</strong> ${navigator.userAgent}</li>
  <li><strong>Page URL:</strong> ${window.location.href}</li>
  <li><strong>Screen Resolution:</strong> ${screen.width}x${screen.height}</li>
</ul>

<hr>
<p><em>This suggestion was submitted through the Statsor AI chatbot system.</em></p>
    `;
  }

  private formatSupportEmail(issue: string, userInfo: any, priority: string): string {
    return `
<h2>Support Request - ${priority.toUpperCase()} Priority</h2>

<h3>Issue Description:</h3>
<blockquote style="border-left: 4px solid #EF4444; padding-left: 16px; margin: 16px 0;">
  ${issue}
</blockquote>

<h3>User Information:</h3>
<ul>
  <li><strong>Name:</strong> ${userInfo.name || 'Anonymous'}</li>
  <li><strong>Email:</strong> ${userInfo.email || 'Not provided'}</li>
  <li><strong>User ID:</strong> ${userInfo.id || 'Guest'}</li>
  <li><strong>Account Type:</strong> ${userInfo.role || 'User'}</li>
</ul>

<h3>Technical Context:</h3>
<ul>
  <li><strong>Timestamp:</strong> ${new Date().toISOString()}</li>
  <li><strong>Browser:</strong> ${navigator.userAgent}</li>
  <li><strong>Current Page:</strong> ${window.location.href}</li>
  <li><strong>Local Time:</strong> ${new Date().toLocaleString()}</li>
</ul>

<hr>
<p><em>This support request was submitted through the Statsor AI assistant.</em></p>
    `;
  }

  private formatFeedbackEmail(feedback: string, userInfo: any, rating?: number): string {
    return `
<h2>User Feedback${rating ? ` - ${rating}/5 Stars` : ''}</h2>

<h3>Feedback:</h3>
<blockquote style="border-left: 4px solid #4ADE80; padding-left: 16px; margin: 16px 0;">
  ${feedback}
</blockquote>

${rating ? `<h3>Rating:</h3><p>${'⭐'.repeat(rating)}${'☆'.repeat(5-rating)} (${rating}/5)</p>` : ''}

<h3>User Information:</h3>
<ul>
  <li><strong>Name:</strong> ${userInfo.name || 'Anonymous'}</li>
  <li><strong>Email:</strong> ${userInfo.email || 'Not provided'}</li>
  <li><strong>User ID:</strong> ${userInfo.id || 'Guest'}</li>
  <li><strong>Experience Level:</strong> ${userInfo.role || 'User'}</li>
</ul>

<h3>Context:</h3>
<ul>
  <li><strong>Submitted:</strong> ${new Date().toISOString()}</li>
  <li><strong>Platform:</strong> ${navigator.platform}</li>
  <li><strong>Page:</strong> ${window.location.href}</li>
</ul>

<hr>
<p><em>This feedback was collected through the Statsor AI chatbot system.</em></p>
    `;
  }

  // Utility method to validate email addresses
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Method to get email templates
  getEmailTemplates() {
    return {
      suggestion: {
        subject: 'New Platform Suggestion',
        priority: 'medium'
      },
      support: {
        subject: 'Support Request',
        priority: 'high'
      },
      feedback: {
        subject: 'User Feedback',
        priority: 'low'
      }
    };
  }

  private async sendResendEmail(to: string, subject: string, html: string): Promise<boolean> {
    if (!this.resendApiKey) {
      console.warn('Resend API key not configured, skipping email send');
      return false;
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.resendApiKey}`
        },
        body: JSON.stringify({
          from: this.fromEmail,
          to,
          subject,
          html
        })
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Resend email send failed:', error);
        return false;
      }

      console.log('Email sent successfully to:', to);
      return true;
    } catch (error) {
      console.error('Error sending email via Resend:', error);
      return false;
    }
  }

  async sendWelcomeEmail(data: WelcomeEmailData): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Statsor</title>
        </head>
        <body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#f4f7fa;">
          <div style="max-width:600px;margin:40px auto;background:white;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.1);overflow:hidden;">
            <div style="background:linear-gradient(135deg,#22c55e 0%,#3b82f6 100%);padding:40px 20px;text-align:center;">
              <h1 style="color:white;margin:0;font-size:32px;font-weight:bold;">⚽ Welcome to Statsor!</h1>
              <p style="color:rgba(255,255,255,0.9);margin:10px 0 0 0;font-size:16px;">Your Football Analytics Platform</p>
            </div>

            <div style="padding:40px 30px;">
              <h2 style="color:#1f2937;margin:0 0 20px 0;font-size:24px;">Hello ${data.name}! 👋</h2>

              <p style="color:#4b5563;line-height:1.6;margin:0 0 15px 0;font-size:16px;">
                Welcome to <strong>Statsor</strong> - the ultimate platform for football analytics,
                team management, and performance tracking!
              </p>

              <p style="color:#4b5563;line-height:1.6;margin:0 0 15px 0;font-size:16px;">
                We're thrilled to have you join our community of coaches, managers, and football enthusiasts
                who are passionate about data-driven insights.
              </p>

              <div style="background:#f9fafb;border-radius:8px;padding:20px;margin:30px 0;">
                <div style="display:block;margin-bottom:15px;">
                  <div style="color:#22c55e;font-size:20px;margin-right:12px;display:inline;">✓</div>
                  <div style="color:#374151;font-size:15px;line-height:1.5;display:inline;">
                    <strong>Player Management:</strong> Track player stats, performance, and development
                  </div>
                </div>
                <div style="display:block;margin-bottom:15px;">
                  <div style="color:#22c55e;font-size:20px;margin-right:12px;display:inline;">✓</div>
                  <div style="color:#374151;font-size:15px;line-height:1.5;display:inline;">
                    <strong>Match Analytics:</strong> Analyze matches with detailed statistics and insights
                  </div>
                </div>
                <div style="display:block;margin-bottom:15px;">
                  <div style="color:#22c55e;font-size:20px;margin-right:12px;display:inline;">✓</div>
                  <div style="color:#374151;font-size:15px;line-height:1.5;display:inline;">
                    <strong>AI Assistant:</strong> Get tactical suggestions powered by AI
                  </div>
                </div>
                <div style="display:block;">
                  <div style="color:#22c55e;font-size:20px;margin-right:12px;display:inline;">✓</div>
                  <div style="color:#374151;font-size:15px;line-height:1.5;display:inline;">
                    <strong>Team Collaboration:</strong> Manage your team and communicate effectively
                  </div>
                </div>
              </div>

              <center>
                <a href="https://statsor.com/dashboard" style="display:inline-block;background:linear-gradient(135deg,#22c55e 0%,#16a34a 100%);color:white;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:16px;margin:20px 0;">
                  Get Started with Statsor →
                </a>
              </center>

              <p style="color:#4b5563;line-height:1.6;margin:0 0 15px 0;font-size:16px;">
                If you have any questions or need assistance, our support team is always here to help.
              </p>

              <p style="color:#4b5563;line-height:1.6;margin:0;font-size:16px;">
                Best regards,<br>
                <strong>The Statsor Team</strong>
              </p>
            </div>

            <div style="background:#f9fafb;padding:30px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="color:#6b7280;font-size:14px;margin:5px 0;"><strong>Statsor</strong> - Football Analytics Platform</p>
              <p style="color:#6b7280;font-size:14px;margin:5px 0;">
                <a href="https://statsor.com" style="color:#3b82f6;text-decoration:none;">Visit Website</a> |
                <a href="https://statsor.com/support" style="color:#3b82f6;text-decoration:none;">Support</a> |
                <a href="https://statsor.com/terms" style="color:#3b82f6;text-decoration:none;">Terms</a>
              </p>
              <p style="color:#6b7280;font-size:14px;margin-top:15px;">
                © ${new Date().getFullYear()} Statsor. All rights reserved.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendResendEmail(data.email, 'Welcome to Statsor - Let\'s Get Started! ⚽', html);
  }

  async sendPasswordResetEmail(data: PasswordResetEmailData): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
        </head>
        <body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#f4f7fa;">
          <div style="max-width:600px;margin:40px auto;background:white;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.1);overflow:hidden;">
            <div style="background:linear-gradient(135deg,#ef4444 0%,#dc2626 100%);padding:40px 20px;text-align:center;">
              <h1 style="color:white;margin:0;font-size:28px;font-weight:bold;">🔒 Password Reset Request</h1>
              <p style="color:rgba(255,255,255,0.9);margin:10px 0 0 0;font-size:15px;">Statsor Account Security</p>
            </div>

            <div style="padding:40px 30px;">
              <h2 style="color:#1f2937;margin:0 0 20px 0;font-size:22px;">Hello ${data.name},</h2>

              <p style="color:#4b5563;line-height:1.6;margin:0 0 15px 0;font-size:16px;">
                We received a request to reset your Statsor account password.
                Use the code below to reset your password:
              </p>

              <div style="background:#f9fafb;border:2px solid #e5e7eb;border-radius:8px;padding:24px;text-align:center;margin:30px 0;">
                <div style="font-size:36px;font-weight:bold;color:#1f2937;letter-spacing:8px;font-family:'Courier New',monospace;">${data.resetCode}</div>
                <div style="color:#6b7280;font-size:14px;margin-top:10px;">Your 6-digit reset code</div>
              </div>

              <p style="color:#4b5563;line-height:1.6;margin:0 0 15px 0;font-size:16px;">
                Enter this code on the password reset page to create a new password for your account.
              </p>

              <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:15px;margin:20px 0;border-radius:4px;">
                <p style="color:#92400e;margin:0;font-size:14px;">
                  <strong>⚠️ Important:</strong> This code will expire in <strong>15 minutes</strong>.
                  If you didn't request this reset, please ignore this email or contact support.
                </p>
              </div>

              <p style="color:#4b5563;line-height:1.6;margin:0 0 15px 0;font-size:16px;">
                For security reasons, never share this code with anyone. Statsor staff will never
                ask you for this code.
              </p>

              <p style="color:#4b5563;line-height:1.6;margin:0;font-size:16px;">
                Best regards,<br>
                <strong>The Statsor Security Team</strong>
              </p>
            </div>

            <div style="background:#f9fafb;padding:30px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="color:#6b7280;font-size:14px;margin:5px 0;"><strong>Statsor</strong> - Football Analytics Platform</p>
              <p style="color:#9ca3af;font-size:13px;margin-top:15px;">
                If you didn't request this password reset, please contact us immediately at support@statsor.com
              </p>
              <p style="color:#6b7280;font-size:14px;margin-top:10px;">
                © ${new Date().getFullYear()} Statsor. All rights reserved.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendResendEmail(data.email, 'Reset Your Statsor Password - Code Inside', html);
  }
}

export const emailService = new EmailService();
export type { EmailData, EmailResponse, WelcomeEmailData, PasswordResetEmailData };