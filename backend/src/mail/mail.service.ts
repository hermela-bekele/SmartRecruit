import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    const smtpConfig = {
      host: this.configService.get<string>('SMTP_HOST') || 'smtp.gmail.com',
      port: this.configService.get<string>('SMTP_PORT') ? 
        parseInt(this.configService.get('SMTP_PORT')) : 587,
      secure: this.configService.get<string>('SMTP_SECURE') === 'true',
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    };

    this.logger.log('Initializing SMTP configuration:', {
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      user: smtpConfig.auth.user,
    });

    this.transporter = nodemailer.createTransport(smtpConfig);

    // Verify SMTP connection
    this.transporter.verify()
      .then(() => {
        this.logger.log('SMTP connection verified successfully');
      })
      .catch((error) => {
        this.logger.error('SMTP connection verification failed:', error);
      });
  }

  async sendPasswordResetEmail(
    email: string,
    token: string,
    isNewAccount: boolean = false
  ): Promise<void> {
    try {
      this.logger.log(`Preparing to send ${isNewAccount ? 'welcome' : 'reset'} email to: ${email}`);
      
      const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
      const resetLink = `${frontendUrl}/reset-password?token=${token}`;
      
      const subject = isNewAccount 
        ? 'Welcome to SmartRecruit - Set Your Password'
        : 'SmartRecruit - Password Reset Request';

      const text = isNewAccount
        ? `Welcome to SmartRecruit!\n\n
           As a new HR team member, you need to set up your password before accessing the system.\n
           Please click the following link to set your password:\n
           ${resetLink}\n\n
           This link will expire in 1 hour for security reasons.\n\n
           If you didn't expect this email, please ignore it.`
        : `You have requested to reset your password.\n\n
           Please click the following link to reset your password:\n
           ${resetLink}\n\n
           This link will expire in 1 hour for security reasons.\n\n
           If you didn't request this, please ignore this email.`;

      const html = isNewAccount
        ? `<h2>Welcome to SmartRecruit!</h2>
           <p>As a new HR team member, you need to set up your password before accessing the system.</p>
           <p>Please click the following button to set your password:</p>
           <p>
             <a href="${resetLink}" style="background-color: #6366F1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
               Set Your Password
             </a>
           </p>
           <p><small>This link will expire in 1 hour for security reasons.</small></p>
           <p><small>If you didn't expect this email, please ignore it.</small></p>`
        : `<h2>Password Reset Request</h2>
           <p>You have requested to reset your password.</p>
           <p>Please click the following button to reset your password:</p>
           <p>
             <a href="${resetLink}" style="background-color: #6366F1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
               Reset Password
             </a>
           </p>
           <p><small>This link will expire in 1 hour for security reasons.</small></p>
           <p><small>If you didn't request this, please ignore this email.</small></p>`;

      const fromEmail = this.configService.get<string>('SMTP_FROM') || 'noreply@smartrecruit.com';

      this.logger.log('Sending email with configuration:', {
        from: fromEmail,
        to: email,
        subject,
        resetLink,
      });

      const result = await this.transporter.sendMail({
        from: fromEmail,
        to: email,
        subject,
        text,
        html,
      });

      this.logger.log('Email sent successfully:', result);
    } catch (error) {
      this.logger.error('Failed to send email:', error);
      throw error;
    }
  }
}
