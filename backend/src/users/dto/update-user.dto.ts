import { IsEmail, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../../shared/user-role.enum';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
