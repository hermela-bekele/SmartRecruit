import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateNotificationsDto } from './dto/update-notifications.dto';
import { ChangePasswordDto } from '../auth/dto/change-password.dto';
import { PasswordResetTokenService } from '../common/entities/password-reset-token-service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UsersService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private passwordResetTokenService: PasswordResetTokenService,
    private mailService: MailService,
  ) {}

  async create(userData: CreateUserDto): Promise<User> {
    if (!userData.password) {
      throw new BadRequestException('Password is required');
    }

    const existingUser = await this.usersRepository.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await this.hashPassword(userData.password);

    const user = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
      passwordResetRequired: true,
    });

    const savedUser = await this.usersRepository.save(user);

    // Send welcome email with credentials
    try {
      if (userData.sendWelcomeEmail) {
        await this.mailService.sendWelcomeEmail(
          savedUser.email,
          userData.password, // Send the original unencrypted password
        );
      } else {
        // Generate password reset token and send email as before
        const resetToken =
          await this.passwordResetTokenService.generateToken(savedUser);
        await this.mailService.sendPasswordResetEmail(
          savedUser.email,
          resetToken,
          true, // indicates this is a new account
        );
      }
    } catch (error) {
      console.error('Error sending email:', error);
      // Don't throw the error as the user is already created
      // Just log it and continue
    }

    return savedUser;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const resetToken =
      await this.passwordResetTokenService.validateToken(token);
    if (!resetToken || resetToken.used) {
      throw new BadRequestException('Invalid or expired token');
    }

    const user = resetToken.user;
    const hashedPassword = await this.hashPassword(newPassword);

    // Update password and mark as not requiring reset
    user.password = hashedPassword;
    user.passwordResetRequired = false;
    await this.usersRepository.save(user);

    // Mark token as used
    resetToken.used = true;
    await this.passwordResetTokenService.markTokenAsUsed(resetToken);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  private async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, this.SALT_ROUNDS);
    } catch (error) {
      throw new Error(`Password hashing failed: ${error.message}`);
    }
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.usersRepository.update(userId, {
      lastLoginAt: new Date(),
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: [
        'id',
        'email',
        'role',
        'createdAt',
        'lastLoginAt',
        'passwordResetRequired',
        'firstName',
        'lastName',
        'jobTitle',
        'department',
        'companyName',
        'website',
        'address',
        'companySize',
        'twoFactorEnabled',
        'newApplicationNotifications',
        'statusChangeNotifications',
        'interviewReminderNotifications',
        'weeklyDigestNotifications',
      ],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      console.log('Updating user with ID:', id);
      console.log('Update data:', updateUserDto);

      const user = await this.usersRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // If updating email, check if it's already taken
      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const existingUser = await this.findByEmail(updateUserDto.email);
        if (existingUser) {
          throw new ConflictException('Email already registered');
        }
      }

      // Update the user with all allowed fields
      Object.assign(user, updateUserDto);
      const savedUser = await this.usersRepository.save(user);
      console.log('User updated successfully:', savedUser);
      return savedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ where: { id: userId } });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      // Update only profile fields
      Object.assign(user, updateProfileDto);
      const savedUser = await this.usersRepository.save(user);
      
      // Return user without sensitive data
      const { password, twoFactorSecret, ...result } = savedUser;
      return result as User;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<void> {
    try {
      const user = await this.usersRepository
        .createQueryBuilder('user')
        .addSelect('user.password')
        .where('user.id = :id', { id: userId })
        .getOne();

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(
        changePasswordDto.oldPassword,
        user.password,
      );

      if (!isCurrentPasswordValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }

      // Hash new password
      const hashedNewPassword = await this.hashPassword(changePasswordDto.newPassword);

      // Update password
      user.password = hashedNewPassword;
      user.passwordResetRequired = false;
      await this.usersRepository.save(user);
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }

  async updateNotifications(userId: string, updateNotificationsDto: UpdateNotificationsDto): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ where: { id: userId } });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      // Update notification preferences
      Object.assign(user, updateNotificationsDto);
      const savedUser = await this.usersRepository.save(user);
      
      // Return user without sensitive data
      const { password, twoFactorSecret, ...result } = savedUser;
      return result as User;
    } catch (error) {
      console.error('Error updating notifications:', error);
      throw error;
    }
  }

  async enable2FA(userId: string): Promise<{ secret: string; qrCode: string }> {
    try {
      const user = await this.usersRepository.findOne({ where: { id: userId } });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      // Generate a secret for 2FA (in a real implementation, you'd use a library like speakeasy)
      const secret = this.generateSecret();
      
      // Update user with 2FA secret (but don't enable yet until verified)
      user.twoFactorSecret = secret;
      await this.usersRepository.save(user);

      // Generate QR code (in a real implementation, you'd use a library like qrcode)
      const qrCode = this.generateQRCode(secret, user.email);

      return { secret, qrCode };
    } catch (error) {
      console.error('Error enabling 2FA:', error);
      throw error;
    }
  }

  async verifyAndEnable2FA(userId: string, code: string): Promise<void> {
    try {
      const user = await this.usersRepository.findOne({ where: { id: userId } });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      if (!user.twoFactorSecret) {
        throw new BadRequestException('2FA secret not found. Please enable 2FA first.');
      }

      // Verify the code (in a real implementation, you'd use a library like speakeasy)
      const isValid = this.verify2FACode(user.twoFactorSecret, code);

      if (!isValid) {
        throw new BadRequestException('Invalid 2FA code');
      }

      // Enable 2FA
      user.twoFactorEnabled = true;
      await this.usersRepository.save(user);
    } catch (error) {
      console.error('Error verifying 2FA:', error);
      throw error;
    }
  }

  async disable2FA(userId: string): Promise<void> {
    try {
      const user = await this.usersRepository.findOne({ where: { id: userId } });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      user.twoFactorEnabled = false;
      user.twoFactorSecret = null;
      await this.usersRepository.save(user);
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      throw error;
    }
  }

  // Helper methods for 2FA (simplified implementations)
  private generateSecret(): string {
    // In a real implementation, use speakeasy.generateSecret()
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private generateQRCode(secret: string, email: string): string {
    // In a real implementation, use qrcode library
    // For now, return a placeholder
    return `otpauth://totp/SmartRecruit:${email}?secret=${secret}&issuer=SmartRecruit`;
  }

  private verify2FACode(secret: string, code: string): boolean {
    // In a real implementation, use speakeasy.totp.verify()
    // For now, return true for demo purposes
    return code.length === 6 && /^\d+$/.test(code);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: [
        'id',
        'email',
        'role',
        'createdAt',
        'lastLoginAt',
        'firstName',
        'lastName',
        'jobTitle',
        'department',
        'companyName',
      ],
    });
  }

  async remove(id: string): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.usersRepository.remove(user);
  }
}
