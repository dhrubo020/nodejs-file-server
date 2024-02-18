import { Module } from '@nestjs/common';
import { AdminMediaController } from './controllers/file.controller';
import { BucketRepository } from './repositories/bucket.repository';
import { FileRepository } from './repositories/file.repository';
import { FileUploadService } from './services/file.upload.services';
import { LocalStorageService } from './services/local.storage.service';

@Module({
  controllers: [AdminMediaController],
  providers: [
    FileUploadService,
    LocalStorageService,
    BucketRepository,
    FileRepository,
  ],
})
export class FileModule {}
