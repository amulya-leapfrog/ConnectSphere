import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { UserService } from './user.service';
import { CustomRequest } from '@/interfaces/jwt';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get()
  getUsers(@Req() req: CustomRequest) {
    try {
      const userId = req.user.id;
      return this.userService.getUsers(userId);
    } catch (error) {
      return error;
    }
  }
}
