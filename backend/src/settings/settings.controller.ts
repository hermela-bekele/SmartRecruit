import {
  Controller,
  Put,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UsersService } from '../users/users.service';
import { UpdateProfileDto } from '../users/dto/update-profile.dto';
import { UpdateNotificationsDto } from '../users/dto/update-notifications.dto';
import { ChangePasswordDto } from '../auth/dto/change-password.dto';

@Controller('settings')
export class SettingsController {
  constructor(private usersService: UsersService) {}

  @Get('test')
  async test() {
    return { message: 'Settings controller is working!' };
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    console.log('SettingsController: Profile update request received');
    console.log('SettingsController: User ID:', req.user.sub);
    console.log('SettingsController: Profile data:', updateProfileDto);
    
    const userId = req.user.sub;
    const updatedUser = await this.usersService.updateProfile(userId, updateProfileDto);
    
    console.log('SettingsController: Profile update successful:', updatedUser);
    return {
      message: 'Profile updated successfully',
      user: updatedUser,
    };
  }

  @Put('password')
  @UseGuards(JwtAuthGuard)
  async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    const userId = req.user.sub;
    await this.usersService.changePassword(userId, changePasswordDto);
    return {
      message: 'Password changed successfully',
    };
  }

  @Put('notifications')
  @UseGuards(JwtAuthGuard)
  async updateNotifications(@Request() req, @Body() updateNotificationsDto: UpdateNotificationsDto) {
    const userId = req.user.sub;
    const updatedUser = await this.usersService.updateNotifications(userId, updateNotificationsDto);
    return {
      message: 'Notification preferences updated successfully',
      user: updatedUser,
    };
  }

  @Post('2fa/enable')
  @UseGuards(JwtAuthGuard)
  async enable2FA(@Request() req) {
    const userId = req.user.sub;
    const result = await this.usersService.enable2FA(userId);
    return {
      message: '2FA setup initiated',
      secret: result.secret,
      qrCode: result.qrCode,
    };
  }

  @Post('2fa/verify')
  @UseGuards(JwtAuthGuard)
  async verify2FA(@Request() req, @Body() body: { code: string }) {
    const userId = req.user.sub;
    await this.usersService.verifyAndEnable2FA(userId, body.code);
    return {
      message: '2FA enabled successfully',
    };
  }

  @Post('2fa/disable')
  @UseGuards(JwtAuthGuard)
  async disable2FA(@Request() req) {
    const userId = req.user.sub;
    await this.usersService.disable2FA(userId);
    return {
      message: '2FA disabled successfully',
    };
  }
} 