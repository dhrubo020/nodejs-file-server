import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from 'src/database/entities/file.entity';
import { AdminMediaController } from './controllers/file.controller';
import { BucketRepository } from './repositories/bucket.repository';
import { FileRepository } from './repositories/file.repository';
import { FileUploadService } from './services/file.upload.services';
import { LocalStorageService } from './services/local.storage.service';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  controllers: [AdminMediaController],
  providers: [
    FileUploadService,
    LocalStorageService,
    BucketRepository,
    FileRepository,
  ],
})
export class FileModule {}
