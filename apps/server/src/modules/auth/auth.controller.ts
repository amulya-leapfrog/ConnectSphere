import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/LoginDto';
import { SignupDto } from './dto/SignupDto';
import { CustomRequest } from '@/interfaces/jwt';
import { RefreshGuard } from './guard/refresh.guard';
import { JwtGuard } from './guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioService } from '../minio.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private minioService: MinioService,
  ) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    try {
      return this.authService.login(loginDto);
    } catch (error) {
      return error;
    }
  }

  @Post('signup')
  @UseInterceptors(FileInterceptor('image'))
  async signup(
    @UploadedFile() file: Express.Multer.File,
    @Body() signupDto: SignupDto,
  ) {
    try {
      if (
        file &&
        !(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))
      ) {
        throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST);
      }

      let fileName: string | null = null;

      if (file) {
        fileName = await this.minioService.uploadFile(file);
      }

      const userInsert = {
        ...signupDto,
        image: fileName,
      };

      return this.authService.signup(userInsert);
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

  @UseGuards(JwtGuard)
  @Get('me')
  getMyData(@Req() req: CustomRequest) {
    const userId = req.user.id;
    return this.authService.getMyData(userId);
  }
}
