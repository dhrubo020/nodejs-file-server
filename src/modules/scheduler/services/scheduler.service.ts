import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { schedulerConfig } from 'config';
import { ProviderEnum } from 'src/interfaces';
import { DBFileRepository } from 'src/modules/file/repositories/db.file.repository';
import { GCPRepository } from 'src/modules/file/repositories/gcp.repository';
import { LocalRepository } from 'src/modules/file/repositories/local.repository';
import { S3Repository } from 'src/modules/file/repositories/s3.repository';
import { IStorageRepository } from 'src/modules/file/repositories/types.repository';
import { SchedulerRepository } from '../repositories/scheduler.repository';

@Injectable()
export class SchedulerService {
  constructor(
    private readonly schedulerRepository: SchedulerRepository,
    private readonly dbFileRepository: DBFileRepository,
    private readonly localRepository: LocalRepository,
    private readonly s3Repository: S3Repository,
    private readonly gcpRepository: GCPRepository,
  ) {}

  /**
   * Scheduler to delete files
   *
   * @return {*}  {Promise<void>}
   * @memberof SchedulerService
   */
  @Cron(schedulerConfig.cronRunAt)
  async handleDeleteFiles(): Promise<void> {
    console.log('--- Corn started ---');

    const toDay = new Date();
    const query = new Date(
      toDay.setDate(toDay.getDate() - schedulerConfig.fileValidityInDays),
    );

    const totalCount = await this.schedulerRepository.totalFileCount(query);
    let skip = 0,
      limit = 20;

    console.log({ totalCount });

    while (skip < totalCount) {
      const remaining = totalCount - skip;
      const batchLimit = remaining < limit ? remaining : limit;
      const files = await this.schedulerRepository.deleteFileInfo(
        query,
        skip,
        batchLimit,
      );
      if (!files || !files?.length) {
        console.log('No file is found to delete by scheduler');
        return;
      }

      await Promise.allSettled(
        files.map(async (e) => {
          // retirve storageRepo by file provider
          const storageRepo = this.resolveStorageRepository(e.provider);
          if (!storageRepo) {
            return;
          }
          // delete from db
          const deletedFile = await this.dbFileRepository.deleteFileInfo(
            e.privateKey,
          );
          if (!deletedFile) {
            console.log('Can not delete file info of', e.fileKey);
          }
          // delete from storage
          const isDeleteFromStorage = await storageRepo.delete(e.fileKey);
          if (!isDeleteFromStorage) {
            // we can keep track of this files that are not deleted from storage
            console.log('Can not delete file from storage', e.fileKey);
          }
          if (deletedFile && isDeleteFromStorage) {
            console.log('File has been deleted', e.fileKey);
          }
        }),
      );
      skip += limit;
    }
    return;
  }

  private resolveStorageRepository(provider: string): IStorageRepository {
    switch (provider) {
      case ProviderEnum.LOCAL:
        return this.localRepository;
      case ProviderEnum.S3_BUCKET:
        return this.s3Repository;
      case ProviderEnum.GCP_BUCKET:
        return this.gcpRepository;
      default: {
        console.log('Unsupported provider');
        return null;
      }
    }
  }
}
