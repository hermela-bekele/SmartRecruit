import { IsEmail, IsOptional, IsEnum, IsString, IsBoolean } from 'class-validator';
import { UserRole } from '../../shared/user-role.enum';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  // Profile fields
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  jobTitle?: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsString()
  @IsOptional()
  companyName?: string;

  @IsString()
  @IsOptional()
  website?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  companySize?: string;

  // Two-factor authentication
  @IsBoolean()
  @IsOptional()
  twoFactorEnabled?: boolean;

  @IsString()
  @IsOptional()
  twoFactorSecret?: string;

  // Notification preferences
  @IsBoolean()
  @IsOptional()
  newApplicationNotifications?: boolean;

  @IsBoolean()
  @IsOptional()
  statusChangeNotifications?: boolean;

  @IsBoolean()
  @IsOptional()
  interviewReminderNotifications?: boolean;

  @IsBoolean()
  @IsOptional()
  weeklyDigestNotifications?: boolean;
}
