import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { securityConfig } from 'config/security';

@Global()
@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ...securityConfig.rateLimit,
      },
    ]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class CustomThrotterModule {}
