import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/LoginDto';
import { SignupDto } from './dto/SignupDto';
import { CustomRequest } from '@/interfaces/jwt';
import { RefreshGuard } from './guard/refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    try {
      return this.authService.login(loginDto);
    } catch (error) {
      return error;
    }
  }

  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    try {
      return this.authService.signup(signupDto);
    } catch (error) {
      return error;
    }
  }

  @UseGuards(RefreshGuard)
  @Post('refresh')
  refresh(@Req() req: CustomRequest) {
    try {
      const userId = req.user.id;
      const accessToken = this.authService.refreshToken(userId);
      return accessToken;
    } catch (error) {
      return error;
    }
  }

  @Get('data')
  getAll() {
    return this.authService.getData();
  }
}
