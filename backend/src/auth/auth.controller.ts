import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt.guard';
import { Public } from './public.decorator';

@Controller('auth')
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('reset-password')
  async requestPasswordReset(@Body('email') email: string) {
    await this.authService.requestPasswordReset(email);
    return { message: 'If the email exists, a reset link will be sent.' };
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
