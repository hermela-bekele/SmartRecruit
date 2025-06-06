import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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

    // Generate password reset token and send email
    try {
      const resetToken =
        await this.passwordResetTokenService.generateToken(savedUser);
      await this.mailService.sendPasswordResetEmail(
        savedUser.email,
        resetToken,
        true, // indicates this is a new account
      );
    } catch (error) {
      console.error('Error sending password reset email:', error);
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

  // Additional recommended methods
  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: ['id', 'email', 'role', 'createdAt', 'lastLoginAt'],
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

      // Only allow updating email and role for existing users
      const allowedUpdates = {
        email: updateUserDto.email,
        role: updateUserDto.role,
      };

      // Update the user with only allowed fields
      Object.assign(user, allowedUpdates);
      const savedUser = await this.usersRepository.save(user);
      console.log('User updated successfully:', savedUser);
      return savedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      console.log('Attempting to delete user with ID:', id);
      const user = await this.usersRepository.findOne({
        where: { id },
        relations: ['resetTokens'],
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      console.log('Found user:', user);

      // First, delete all related password reset tokens
      if (user.resetTokens && user.resetTokens.length > 0) {
        console.log('Deleting related password reset tokens...');
        await this.usersRepository
          .createQueryBuilder()
          .relation(User, 'resetTokens')
          .of(user)
          .delete();
      }

      // Then delete the user
      await this.usersRepository.remove(user);
      console.log('User successfully deleted');
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}
