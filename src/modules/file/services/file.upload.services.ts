import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { providerConfig } from 'config';
import { randomUUID } from 'crypto';
import { Response } from 'express';
import { IFileUploadRes, ProviderEnum } from 'src/interfaces';
import { exception, IServiceResponse, successResponse } from 'src/utils';
import { DBFileRepository } from '../repositories/db.file.repository';
import { IStorageRepository } from '../repositories/types.repository';

@Injectable()
export class FileUploadService {
  private provider: ProviderEnum;
  constructor(
    private readonly dbFileRepository: DBFileRepository,
    @Inject('STORAGE_REPOSITORY_TOKEN')
    private readonly storageRepository: IStorageRepository,
  ) {
    this.provider = providerConfig.name as ProviderEnum;
  }

  async uploadFiles(
    file: Express.Multer.File,
  ): Promise<IServiceResponse<IFileUploadRes>> {
    const publicKey = this.generateKey();
    const privateKey = this.generateKey();
    const mimeType = file.mimetype;
    const fileKey = file.originalname;
    const uploaded = await this.storageRepository.upload(file);
    if (!uploaded.success) {
      throw exception(uploaded.message, HttpStatus.CONFLICT);
    }
    const savedFile = await this.dbFileRepository.saveFileInfo({
      fileKey,
      mimeType,
      privateKey,
      publicKey,
      provider: this.provider,
    });
    if (!savedFile) {
      // we can try again to save file info or deliver to another service to handle this situation
      exception(
        'Error in saving file information, please upload again',
        HttpStatus.CONFLICT,
      );
    }
    return successResponse({
      privateKey,
      publicKey,
    });
  }

  private generateKey(): string {
    return randomUUID();
  }

  async getFile(publicKey: string, res: Response): Promise<any> {
    const fileInfo = await this.dbFileRepository.getFileInfo(publicKey);
    if (!fileInfo) {
      exception('File not found', HttpStatus.NOT_FOUND);
    }
    const { fileKey, mimeType } = fileInfo;
    res.setHeader('Content-Type', mimeType);
    const fileStream = (await this.storageRepository.retrive(fileKey)) as any;
    if (!fileStream) {
      exception(
        'The specified key does not exist on storage location',
        HttpStatus.NOT_FOUND,
      );
    }
    return fileStream.pipe(res);
  }

  async deleteFile(
    privateKey: string,
  ): Promise<IServiceResponse<{ message: string }>> {
    const fileInfo = await this.dbFileRepository.deleteFileInfo(privateKey);
    if (!fileInfo) {
      exception(
        'Can not delete the file or file not found',
        HttpStatus.NOT_FOUND,
      );
    }
    const isDeleted = (await this.storageRepository.delete(
      fileInfo.fileKey,
    )) as any;
    if (!isDeleted) {
      exception(
        'The specified key does not exist on storage location',
        HttpStatus.NOT_FOUND,
      );
    }
    return successResponse({ message: 'File has been deleted successfully' });
  }

  // private async handleUpload(
  //   file: Express.Multer.File,
  //   provider: ProviderEnum,
  // ): Promise<IUploadedData> {
  //   switch (provider) {
  //     case ProviderEnum.LOCAL: {
  //       return await this.localRepository.upload(file);
  //     }
  //     case ProviderEnum.S3_BUCKET: {
  //       return await this.s3Repository.upload(file);
  //     }
  //     case ProviderEnum.GCP_BUCKET: {
  //       return await this.gcpRepository.upload(file);
  //     }
  //     default:
  //       return null;
  //   }
  // }

  // private async handleRetriveFile(fileKey: string, provider: ProviderEnum) {
  //   switch (provider) {
  //     case ProviderEnum.LOCAL: {
  //       return await this.localRepository.retrive(fileKey);
  //     }
  //     case ProviderEnum.S3_BUCKET: {
  //       return await this.s3Repository.retrive(fileKey);
  //     }
  //     default:
  //       return null;
  //   }
  // }

  // private async handleDeleteFile(fileKey: string, provider: ProviderEnum) {
  //   switch (provider) {
  //     case ProviderEnum.LOCAL: {
  //       return await this.localRepository.delete(fileKey);
  //     }
  //     case ProviderEnum.S3_BUCKET: {
  //       return await this.s3Repository.delete(fileKey);
  //     }
  //     default:
  //       return null;
  //   }
  // }
}
