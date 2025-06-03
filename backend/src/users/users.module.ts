import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';
import { PasswordResetTokenService } from '../common/entities/password-reset-token-service';
import { PasswordResetToken } from '../common/entities/password-reset-token.entity';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User, PasswordResetToken]),
    MailModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, PasswordResetTokenService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
