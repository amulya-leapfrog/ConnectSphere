import { CustomRequest } from '@/interfaces/jwt';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';

@Controller('users')
export class UserController {
  constructor() {}

  @UseGuards(JwtGuard)
  @Get()
  getUsers(@Req() req: CustomRequest) {
    return { id: req.user?.id };
  }
}
