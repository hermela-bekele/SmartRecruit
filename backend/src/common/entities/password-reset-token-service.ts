// src/auth/password-reset-token.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { PasswordResetToken } from './password-reset-token.entity';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { User } from '../../users/user.entity';

@Injectable()
export class PasswordResetTokenService {
  constructor(
    @InjectRepository(PasswordResetToken)
    private tokenRepository: Repository<PasswordResetToken>,
  ) {}

  async generateToken(user: User): Promise<string> {
    // Clean up any existing tokens for this user
    await this.tokenRepository.delete({ user: { id: user.id } });

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour

    await this.tokenRepository.save({
      token: await bcrypt.hash(token, 10),
      expiresAt,
      user,
    });

    return token;
  }

  async validateToken(token: string): Promise<PasswordResetToken> {
    // Clean up expired tokens
    await this.tokenRepository.delete({
      expiresAt: LessThan(new Date()),
    });

    // Find all valid tokens
    const resetTokens = await this.tokenRepository
      .createQueryBuilder('token')
      .leftJoinAndSelect('token.user', 'user')
      .where('token.used = :used', { used: false })
      .andWhere('token.expiresAt > :now', { now: new Date() })
      .getMany();

    // Find the matching token
    for (const resetToken of resetTokens) {
      const isValid = await bcrypt.compare(token, resetToken.token);
      if (isValid) {
        return resetToken;
      }
    }

    throw new BadRequestException('Invalid or expired token');
  }

  async markTokenAsUsed(token: PasswordResetToken): Promise<void> {
    token.used = true;
    await this.tokenRepository.save(token);
  }
}
