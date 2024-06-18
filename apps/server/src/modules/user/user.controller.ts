import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { UserService } from './user.service';
import { CustomRequest } from '@/interfaces/jwt';
import {
  ApproveFriendDto,
  DeleteFriendDto,
  FriendReqDto,
} from './dto/FriendReqDto';

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

  @UseGuards(JwtGuard)
  @Get('recommend')
  recommendingUsers(@Req() req: CustomRequest) {
    try {
      const userId = req.user.id;
      return this.userService.recommendingUsers(userId);
    } catch (error) {
      return error;
    }
  }

  @UseGuards(JwtGuard)
  @Post('request')
  sendFriendRequest(
    @Req() req: CustomRequest,
    @Body() friendReqDto: FriendReqDto,
  ) {
    try {
      const userId = req.user.id;
      return this.userService.sendFriendRequest(userId, friendReqDto.targetId);
    } catch (error) {
      return error;
    }
  }

  @UseGuards(JwtGuard)
  @Get('friends')
  getMyFriends(@Req() req: CustomRequest) {
    try {
      const userId = req.user.id;
      return this.userService.getMyFriends(userId);
    } catch (error) {
      return error;
    }
  }

  @UseGuards(JwtGuard)
  @Post('friends/delete')
  deleteMyFriend(@Body() deleteFriendDto: DeleteFriendDto) {
    const edgeId = deleteFriendDto.edgeId;
    return this.userService.deleteMyFriend(edgeId);
  }

  @UseGuards(JwtGuard)
  @Post('friends/approve')
  approveMyFriend(@Body() approveFriendDto: ApproveFriendDto) {
    const edgeId = approveFriendDto.edgeId;
    return this.userService.approveMyFriend(edgeId);
  }
}
