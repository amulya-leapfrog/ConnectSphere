import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GremlinService } from '../gremlin/gremlin.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy, RefreshStrategy } from './strategy';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshStrategy, GremlinService],
})
export class AuthModule {}
