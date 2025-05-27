import { IsNotEmpty, IsDateString, IsOptional } from 'class-validator';

export class CreateJobDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  department: string;

  @IsNotEmpty()
  location: string;

  @IsNotEmpty()
  company?: string;

  @IsNotEmpty()
  employmentType: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsDateString()
  postingDate: Date;

  @IsOptional()
  @IsDateString()
  expirationDate?: Date;
}
