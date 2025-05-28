// src/auth/password-reset-token.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
}
