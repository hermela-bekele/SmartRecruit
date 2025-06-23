import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateNotificationsDto {
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
