import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JobsModule } from './jobs/jobs.module';
import { ApplicationsModule } from './applications/applications.module';
import { MailModule } from './mail/mail.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const portStr = configService.get<string>('DB_PORT');
        const port = portStr ? parseInt(portStr) : 5432;

        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST') || 'localhost',
          port,
          username: configService.get<string>('DB_USERNAME') || 'postgres',
          password: configService.get<string>('DB_PASSWORD') || 'password',
          database:
            configService.get<string>('DB_NAME') || 'application-tracker',
          autoLoadEntities: true,
          synchronize: configService.get<string>('NODE_ENV') === 'development',
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    JobsModule,
    ApplicationsModule,
    MailModule,
    DashboardModule,
  ],
})
export class AppModule {}
