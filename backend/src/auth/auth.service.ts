import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
/* import { MailerService } from '@nestjs-modules/mailer'; */
import { PasswordResetTokenService } from '../common/entities/password-reset-token-service';
import { LoginDto } from './dto/login.dto';

export interface JwtPayload {
  email: string;
  sub: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private passwordResetTokenService: PasswordResetTokenService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const { password: _, ...result } = user;
    void _; // Explicitly mark as unused
    return result;
  }

  async login(user: LoginDto) {
    try {
      const validatedUser = await this.validateUser(user.email, user.password);

      const payload: JwtPayload = {
        email: validatedUser.email,
        sub: validatedUser.id,
        role: validatedUser.role,
      };

      const access_token = this.jwtService.sign(payload);

      return {
        access_token,
        user: {
          id: validatedUser.id,
          email: validatedUser.email,
          role: validatedUser.role,
        },
      };
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      // We don't want to reveal if the email exists or not
      return;
    }

    await this.passwordResetTokenService.generateToken(user);

    // For future implementation of email service
    // await this.mailerService.sendMail({
    //   to: email,
    //   subject: 'Password Reset Request',
    //   template: 'password-reset',
    //   context: {
    //     name: user.email,
    //     resetLink: `${process.env.FRONTEND_URL}/reset-password?token=${token}`,
    //   },
    // });
  }

  async validateToken(token: string): Promise<JwtPayload> {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      return payload;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
