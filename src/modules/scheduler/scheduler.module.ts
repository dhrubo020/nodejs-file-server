import { Module, OnModuleInit } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from 'src/database/entities/file.entity';
import { FileModule } from '../file/file.module';
import { SchedulerRepository } from './repositories/scheduler.repository';
import { SchedulerService } from './services/scheduler.service';

@Module({
  imports: [
    FileModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([FileEntity]),
  ],
  providers: [SchedulerService, SchedulerRepository],
})
export class TaskSchedulerModule {}

// //used to test the corn job
// export class TaskSchedulerModule implements OnModuleInit {
//   constructor(private readonly schedulerService: SchedulerService) {}

//   async onModuleInit() {
//     await this.schedulerService.handleDeleteFiles();
//   }
// }
