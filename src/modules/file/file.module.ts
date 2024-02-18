import { Module } from '@nestjs/common';
import { AdminMediaController } from './controllers/file.controller';
import { FileRepository } from './repositories/file.repository';
import { CloudStorageService } from './services/cloud.storage.service';
import { FileUploadService } from './services/file.upload.services';
import { LocalStorageService } from './services/local.storage.service';

@Module({
  controllers: [AdminMediaController],
  providers: [
    FileUploadService,
    LocalStorageService,
    CloudStorageService,
    FileRepository,
  ],
})
export class FileModule {}
