import { IsString, IsEmail, IsOptional, IsUUID, IsArray } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateApplicationDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  position: string;

  @IsString()
  company: string;

  @IsString()
  jobId: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    }
    return value || [];
  })
  skills?: string[];

  @IsString()
  @IsOptional()
  coverLetter?: string;

  @IsArray()
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    }
    return value || [];
  })
  timeline?: { date: string; status: string }[];
}
