import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from 'src/database/entities/file.entity';
import { AdminMediaController } from './controllers/file.controller';
import { S3Repository } from './repositories/s3.repository';
import { DBFileRepository } from './repositories/db.file.repository';
import { GCPRepository } from './repositories/gcp.repository';
import { FileUploadService } from './services/file.upload.services';
import { LocalRepository } from './repositories/local.repository';
import { providerConfig } from 'config';
import { ProviderEnum } from 'src/interfaces';
import { IStorageRepository } from './repositories/types.repository';

export function storageRepositoryFactory(
  localRepository: LocalRepository,
  s3Repository: S3Repository,
  gcpRepository: GCPRepository,
): IStorageRepository {
  console.log('[Provider found]:', providerConfig.name);
  switch (providerConfig.name) {
    case ProviderEnum.LOCAL:
      return localRepository;
    case ProviderEnum.S3_BUCKET:
      return s3Repository;
    case ProviderEnum.GCP_BUCKET:
      return gcpRepository;
    default: {
      console.log('Unsupported provider');
      return null;
    }
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  controllers: [AdminMediaController],
  providers: [
    FileUploadService,
    LocalRepository,
    S3Repository,
    DBFileRepository,
    GCPRepository,
    {
      provide: 'STORAGE_REPOSITORY_TOKEN',
      useFactory: storageRepositoryFactory,
      inject: [LocalRepository, S3Repository, GCPRepository],
    },
  ],
  exports: [DBFileRepository, LocalRepository, S3Repository, GCPRepository],
})
export class FileModule {}
