import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { GremlinService } from '../gremlin/gremlin.service';
import { MinioService } from '../minio.service';
import { VertexParser } from '@/utils/vertexDataParser';

@Module({
  controllers: [UserController],
  providers: [UserService, GremlinService, MinioService, VertexParser],
})
export class UserModule {}
