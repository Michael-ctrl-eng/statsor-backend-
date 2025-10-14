const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs').promises;
const path = require('path');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  async initializeTransporter() {
    try {
      // Check if email credentials are properly configured
      if (!process.env.SMTP_PASS || process.env.SMTP_PASS === 'temp_password_placeholder') {
        console.log('⚠️ Email service disabled - no valid credentials configured');
        this.transporter = null;
        return;
      }

      // Configure nodemailer with Resend SMTP
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.resend.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true' || true,
        auth: {
          user: process.env.SMTP_USER || 'resend',
          pass: process.env.SMTP_PASS // Resend API key
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      // Verify connection
      await this.transporter.verify();
      console.log('✅ Email service initialized successfully with Resend');
    } catch (error) {
      console.error('❌ Email service initialization failed:', error.message);
      console.log('⚠️ Email service disabled - continuing without email functionality');
      this.transporter = null;
      // Don't throw error to prevent app crash, just log it
    }
  }

  async sendEmail(options) {
    try {
      if (!this.transporter) {
        console.log('⚠️ Email service not available - skipping email send');
        return { success: false, error: 'Email service not configured' };
      }

      const mailOptions = {
        from: process.env.EMAIL_FROM || `"Statsor Team" <noreply@statsor.com>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || this.stripHtml(options.html)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email sent successfully to ${options.to}:`, result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Failed to send email:', error.message);
      return { success: false, error: error.message };
    }
  }

  async sendWelcomeEmail(user) {
    try {
      const templatePath = path.join(__dirname, '../templates/welcome-email.hbs');
      const templateSource = await fs.readFile(templatePath, 'utf8');
      const template = handlebars.compile(templateSource);

      const html = template({
        firstName: user.first_name || user.name || 'User',
        lastName: user.last_name || '',
        email: user.email,
        appUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
        supportEmail: 'statsor1@gmail.com',
        year: new Date().getFullYear(),
        sport: user.sport || 'football',
        role: user.role || 'player'
      });

      return await this.sendEmail({
        to: user.email,
        subject: '🎉 Welcome to Statsor - Your Football Management Journey Begins!',
        html
      });
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error.message);
      return { success: false, error: error.message };
    }
  }

  async sendPasswordResetEmail(user, resetToken) {
    try {
      const templatePath = path.join(__dirname, '../templates/password-reset-email.hbs');
      const templateSource = await fs.readFile(templatePath, 'utf8');
      const template = handlebars.compile(templateSource);

      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
      
      const html = template({
        firstName: user.first_name || user.name || 'User',
        resetUrl,
        resetToken,
        appUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
        supportEmail: 'statsor1@gmail.com',
        year: new Date().getFullYear(),
        expiryTime: '1 hour'
      });

      return await this.sendEmail({
        to: user.email,
        subject: '🔐 Reset Your Statsor Password',
        html
      });
    } catch (error) {
      console.error('❌ Failed to send password reset email:', error.message);
      return { success: false, error: error.message };
    }
  }

  async sendVerificationEmail(user, verificationToken) {
    try {
      const templatePath = path.join(__dirname, '../templates/verification-email.hbs');
      const templateSource = await fs.readFile(templatePath, 'utf8');
      const template = handlebars.compile(templateSource);

      const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
      
      const html = template({
        firstName: user.first_name || user.name || 'User',
        verificationUrl,
        verificationToken,
        appUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
        supportEmail: 'statsor1@gmail.com',
        year: new Date().getFullYear()
      });

      return await this.sendEmail({
        to: user.email,
        subject: '✅ Verify Your Statsor Account',
        html
      });
    } catch (error) {
      console.error('❌ Failed to send verification email:', error.message);
      return { success: false, error: error.message };
    }
  }

  async sendPasswordResetCodeEmail(user, resetCode) {
    try {
      const templatePath = path.join(__dirname, '../templates/password-reset-code-email.hbs');
      const templateSource = await fs.readFile(templatePath, 'utf8');
      const template = handlebars.compile(templateSource);

      const html = template({
        firstName: user.first_name || user.name || 'User',
        resetCode,
        appUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
        supportEmail: 'statsor1@gmail.com',
        year: new Date().getFullYear(),
        expiryTime: '15 minutes',
        email: user.email,
        requestTime: new Date().toLocaleString(),
        ipAddress: 'Hidden for security',
        userAgent: 'Hidden for security'
      });

      return await this.sendEmail({
        to: user.email,
        subject: '🔑 Your Statsor Password Reset Code',
        html
      });
    } catch (error) {
      console.error('❌ Failed to send password reset code email:', error.message);
      return { success: false, error: error.message };
    }
  }

  stripHtml(html) {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }

  // Test email functionality
  async testEmail(toEmail = 'statsor1@gmail.com') {
    try {
      const result = await this.sendEmail({
        to: toEmail,
        subject: '🧪 Statsor Email Service Test',
        html: `
          <h2>Email Service Test</h2>
          <p>This is a test email from Statsor platform.</p>
          <p>Sent at: ${new Date().toISOString()}</p>
          <p>If you receive this, the email service is working correctly!</p>
        `
      });
      return result;
    } catch (error) {
      console.error('❌ Email test failed:', error.message);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();

// Mock email service for testing without actual email provider
// This is a simplified version for demonstration purposes

const logger = {
  info: (msg) => console.log(`[EMAIL INFO] ${msg}`),
  warn: (msg) => console.warn(`[EMAIL WARN] ${msg}`),
  error: (msg) => console.error(`[EMAIL ERROR] ${msg}`)
};

class MockEmailService {
  constructor() {
    logger.info('Mock email service initialized');
  }

  async sendVerificationEmail(to, data) {
    try {
      logger.info(`Sending verification email to: ${to}`);
      logger.info(`Verification URL: ${data.verificationUrl}`);
      
      // In a real implementation, you would send an actual email here
      // For mocking, we just log the details
      
      return {
        success: true,
        messageId: `mock_msg_${Date.now()}`,
        to: to
      };
    } catch (error) {
      logger.error(`Error sending verification email to ${to}: ${error.message}`);
      throw error;
    }
  }

  async sendPasswordResetEmail(to, data) {
    try {
      logger.info(`Sending password reset email to: ${to}`);
      logger.info(`Reset code: ${data.resetCode}`);
      
      // In a real implementation, you would send an actual email here
      // For mocking, we just log the details
      
      return {
        success: true,
        messageId: `mock_msg_${Date.now()}`,
        to: to
      };
    } catch (error) {
      logger.error(`Error sending password reset email to ${to}: ${error.message}`);
      throw error;
    }
  }

  async sendWelcomeEmail(to, data) {
    try {
      logger.info(`Sending welcome email to: ${to}`);
      
      // In a real implementation, you would send an actual email here
      // For mocking, we just log the details
      
      return {
        success: true,
        messageId: `mock_msg_${Date.now()}`,
        to: to
      };
    } catch (error) {
      logger.error(`Error sending welcome email to ${to}: ${error.message}`);
      throw error;
    }
  }

  async sendNotificationEmail(to, data) {
    try {
      logger.info(`Sending notification email to: ${to}`);
      logger.info(`Subject: ${data.subject}`);
      
      // In a real implementation, you would send an actual email here
      // For mocking, we just log the details
      
      return {
        success: true,
        messageId: `mock_msg_${Date.now()}`,
        to: to
      };
    } catch (error) {
      logger.error(`Error sending notification email to ${to}: ${error.message}`);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return {
      status: 'healthy',
      service: 'mock-email',
      timestamp: new Date().toISOString()
    };
  }
}

// Export mock email service
const emailService = new MockEmailService();

module.exports = emailService;
