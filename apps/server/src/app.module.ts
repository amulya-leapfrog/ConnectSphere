import { Module } from '@nestjs/common';

import { AuthModule } from './modules/auth/auth.module';
import { GremlinModule } from './modules/gremlin/gremlin.module';

@Module({
  imports: [GremlinModule, AuthModule],
})
export class AppModule {}
