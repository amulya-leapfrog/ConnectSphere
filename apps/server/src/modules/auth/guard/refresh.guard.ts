import { AuthGuard } from '@nestjs/passport';

export class RefreshGuard extends AuthGuard('refresh-token') {
  constructor() {
    super();
  }
}
