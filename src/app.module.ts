import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigModule } from './database/ormConfig/typeOrm.config.module';
import { FileModule } from './modules/file/file.module';

@Module({
  imports: [FileModule, TypeOrmConfigModule],
})
export class AppModule {}
