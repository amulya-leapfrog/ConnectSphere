import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { GremlinService } from '../gremlin/gremlin.service';
import { MinioService } from '../minio.service';

@Module({
  controllers: [UserController],
  providers: [UserService, GremlinService, MinioService],
})
export class UserModule {}
