import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FriendReqDto {
  @IsNumber()
  @IsNotEmpty()
  targetId: number;
}

export class DeleteFriendDto {
  @IsString()
  @IsNotEmpty()
  edgeId: string;
}

export class ApproveFriendDto {
  @IsString()
  @IsNotEmpty()
  edgeId: string;
}
