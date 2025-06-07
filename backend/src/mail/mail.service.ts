import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    // Debug: Log all SMTP-related environment variables
    const smtpUser = this.configService.get<string>('SMTP_USER');

    this.logger.debug('SMTP Credentials Check:', {
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<string>('SMTP_PORT'),
      secure: this.configService.get<string>('SMTP_SECURE'),
      user: smtpUser,
      from: this.configService.get<string>('SMTP_FROM'),
      hasPassword: !!this.configService.get<string>('SMTP_PASS'),
      passwordLength: this.configService.get<string>('SMTP_PASS')?.length || 0,
    });

    if (!smtpUser?.includes('@')) {
      this.logger.error(
        'Invalid SMTP_USER: Email address must be complete (e.g., example@gmail.com)',
      );
    }

    // Parse port number (fallback to 587 if invalid)
    const portStr = this.configService.get<string>('SMTP_PORT');
    const port = portStr ? parseInt(portStr, 10) : 587;

    // Handle secure connection properly (true for 465, false otherwise)
    let secure = this.configService.get<string>('SMTP_SECURE') === 'true';
    if (port === 465 && !secure) {
      this.logger.warn('Forcing secure=true for port 465 (required by Gmail)');
      secure = true;
    }

    const smtpConfig = {
      host: this.configService.get<string>('SMTP_HOST') || 'smtp.gmail.com',
      port: port,
      secure: secure,
      auth: {
        user: smtpUser,
        pass: this.configService.get<string>('SMTP_PASS'),
      },
      tls: {
        rejectUnauthorized: true, // Verify SSL certificates
      },
      connectionTimeout: 10000, // Increased to 10 seconds
      greetingTimeout: 10000,
      socketTimeout: 10000,
    };

    this.logger.log('Initializing SMTP configuration:', {
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      user: smtpConfig.auth.user,
      timeouts: {
        connection: smtpConfig.connectionTimeout,
        greeting: smtpConfig.greetingTimeout,
        socket: smtpConfig.socketTimeout,
      },
    });

    this.transporter = nodemailer.createTransport(smtpConfig);

    // Verify SMTP connection
    this.transporter
      .verify()
      .then(() => {
        this.logger.log('SMTP connection verified successfully');
      })
      .catch((error) => {
        this.logger.error('SMTP connection verification failed:', error);
        if (error.code === 'EAUTH') {
          this.logger.error('Authentication failed. Please check:');
          this.logger.error(
            '1. 2-Step Verification is enabled in your Google Account',
          );
          this.logger.error(
            '2. You are using an App Password, not your regular Gmail password',
          );
          this.logger.error('3. The App Password has no spaces');
          this.logger.error('4. SMTP_USER is your complete Gmail address');
          this.logger.error('5. SMTP_FROM matches SMTP_USER exactly');
        } else if (error.code === 'ESOCKET') {
          this.logger.error('Connection failed. Please check:');
          this.logger.error('1. Your internet connection is stable');
          this.logger.error('2. No firewall is blocking SMTP traffic');
          this.logger.error(
            '3. Try using a different network (e.g., mobile hotspot)',
          );
          this.logger.error(
            '4. Try using port 587 with SMTP_SECURE=false if issues persist',
          );
        }
      });
  }

  async sendPasswordResetEmail(
    email: string,
    token: string,
    isNewAccount: boolean = false,
  ): Promise<void> {
    try {
      this.logger.log(
        `Preparing to send ${isNewAccount ? 'welcome' : 'reset'} email to: ${email}`,
      );

      const frontendUrl =
        this.configService.get<string>('FRONTEND_URL') ||
        'http://localhost:5173';
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

      const fromEmail =
        this.configService.get<string>('SMTP_FROM') ||
        'noreply@smartrecruit.com';

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

  async sendCandidateEmail(
    email: string,
    subject: string,
    content: string,
  ): Promise<void> {
    try {
      this.logger.log('Starting sendCandidateEmail with params:', {
        email,
        subject,
        contentLength: content?.length || 0,
      });

      if (!email || !subject || !content) {
        throw new Error('Missing required email parameters');
      }

      const fromEmail =
        this.configService.get<string>('SMTP_FROM') ||
        'noreply@smartrecruit.com';

      this.logger.log('Sending email with configuration:', {
        from: fromEmail,
        to: email,
        subject,
        hasContent: !!content,
      });

      const mailOptions = {
        from: fromEmail,
        to: email,
        subject,
        text: content,
        html: content.replace(/\n/g, '<br/>'), // Simple conversion of newlines to HTML breaks
      };

      this.logger.debug('Mail options prepared:', mailOptions);

      const result = await this.transporter.sendMail(mailOptions);

      this.logger.log('Email sent successfully:', {
        messageId: result.messageId,
        response: result.response,
        envelope: result.envelope,
      });
    } catch (error) {
      this.logger.error('Failed to send email:', {
        error: error.message,
        stack: error.stack,
        code: error.code,
        command: error.command,
      });
      throw error;
    }
  }

  async sendWelcomeEmail(email: string, tempPassword: string): Promise<void> {
    try {
      this.logger.log(`Preparing to send welcome email with credentials to: ${email}`);

      const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
      const loginUrl = `${frontendUrl}/login`;

      const subject = 'Welcome to SmartRecruit - Your Account Credentials';

      const text = `Welcome to SmartRecruit!\n\n
        Your HR account has been created successfully. Here are your login credentials:\n\n
        Email: ${email}\n
        Temporary Password: ${tempPassword}\n\n
        For security reasons, please follow these steps:\n
        1. Login using the temporary password at: ${loginUrl}\n
        2. Change your password immediately after your first login\n\n
        Important Security Notes:\n
        - This temporary password will expire in 24 hours\n
        - Never share your password with anyone\n
        - Choose a strong password that includes numbers, special characters, and mixed case letters\n\n
        If you have any issues logging in, please contact your system administrator.\n\n
        Best regards,\n
        The SmartRecruit Team`;

      const html = `
        <h2>Welcome to SmartRecruit!</h2>
        <p>Your HR account has been created successfully. Here are your login credentials:</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Temporary Password:</strong> ${tempPassword}</p>
        </div>

        <h3>Important Next Steps:</h3>
        <ol>
          <li>Login using the temporary password at: <a href="${loginUrl}">${loginUrl}</a></li>
          <li>Change your password immediately after your first login</li>
        </ol>

        <div style="background-color: #fff3cd; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h4 style="color: #856404; margin-top: 0;">Security Notes:</h4>
          <ul style="color: #856404;">
            <li>This temporary password will expire in 24 hours</li>
            <li>Never share your password with anyone</li>
            <li>Choose a strong password that includes numbers, special characters, and mixed case letters</li>
          </ul>
        </div>

        <p>If you have any issues logging in, please contact your system administrator.</p>

        <p>Best regards,<br>The SmartRecruit Team</p>`;

      const fromEmail = this.configService.get<string>('SMTP_FROM') || 'noreply@smartrecruit.com';

      this.logger.log('Sending welcome email with configuration:', {
        from: fromEmail,
        to: email,
        subject
      });

      const result = await this.transporter.sendMail({
        from: fromEmail,
        to: email,
        subject,
        text,
        html
      });

      this.logger.log('Welcome email sent successfully:', result);
    } catch (error) {
      this.logger.error('Failed to send welcome email:', error);
      throw error;
    }
  }
}
