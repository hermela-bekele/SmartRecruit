import { IsEmail, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../../shared/user-role.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  passwordResetRequired?: boolean;
}
