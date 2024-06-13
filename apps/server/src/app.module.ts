import { Module } from '@nestjs/common';

import { AuthModule } from './modules/auth/auth.module';
import { GremlinModule } from './modules/gremlin/gremlin.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [GremlinModule, AuthModule, UserModule],
})
export class AppModule {}
