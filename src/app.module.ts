import { Module } from '@nestjs/common';
import { TypeOrmConfigModule } from './database/ormConfig/typeOrm.config.module';
import { FileModule } from './modules/file/file.module';
import { CustomThrotterModule } from './modules/rate-limit/throttler.module';
import { TaskSchedulerModule } from './modules/scheduler/scheduler.module';

@Module({
  imports: [
    FileModule,
    TypeOrmConfigModule,
    CustomThrotterModule,
    TaskSchedulerModule,
  ],
})
export class AppModule {}
