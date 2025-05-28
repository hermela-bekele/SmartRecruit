import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '../../shared/user-role.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsEnum(['SUPER_ADMIN', 'HR_ADMIN'])
  role: UserRole;
}
