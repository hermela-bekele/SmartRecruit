import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { PasswordResetTokenService } from 'src/common/entities/password-reset-token-service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordResetToken } from 'src/common/entities/password-reset-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PasswordResetToken]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN', '1h'),
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    //    MailerModule.forRootAsync({
    //     imports: [ConfigModule],
    //     useFactory: (configService: ConfigService) => ({
    //       transport: {
    //         host: configService.get<string>('MAIL_HOST'),
    //         port: configService.get<number>('MAIL_PORT'),
    //         secure: configService.get<boolean>('MAIL_SECURE', false),
    //         auth: {
    //           user: configService.get<string>('MAIL_USER'),
    //           pass: configService.get<string>('MAIL_PASSWORD'),
    //         },
    //       },
    //   }),
    // }),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, AuthService, PasswordResetTokenService],
  exports: [JwtModule],
})
export class AuthModule {}
