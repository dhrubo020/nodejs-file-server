import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { securityConfig } from 'config/security';
import { TypeOrmConfigModule } from './database/ormConfig/typeOrm.config.module';
import { FileModule } from './modules/file/file.module';
import { CustomThrotterModule } from './modules/rate-limit/throttler.module';

@Module({
  imports: [FileModule, TypeOrmConfigModule, CustomThrotterModule],
})
export class AppModule {}
