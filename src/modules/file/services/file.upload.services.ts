import { HttpStatus, Injectable, Res } from '@nestjs/common';
import { providerConfig } from 'config';
import { randomUUID } from 'crypto';
import { Response } from 'express';
import { ReadStream } from 'fs';
import { IFileUploadRes, IUploadedData, ProviderEnum } from 'src/interfaces';
import { exception, IServiceResponse, successResponse } from 'src/utils';
import { FileRepository } from '../repositories/file.repository';
import { CloudStorageService } from './cloud.storage.service';
import { LocalStorageService } from './local.storage.service';

@Injectable()
export class FileUploadService {
  private provider: ProviderEnum;
  constructor(
    private readonly localStorageService: LocalStorageService,
    private readonly cloudStorageService: CloudStorageService,
    private readonly fileRepository: FileRepository,
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
    const uploaded = await this.handleUpload(file);
    if (!uploaded.success) {
      throw exception(uploaded.message, HttpStatus.CONFLICT);
    }
    const savedFile = await this.fileRepository.saveFileInfo({
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
    const fileInfo = await this.fileRepository.getFileInfo(publicKey);
    if (!fileInfo) {
      exception('File not found', HttpStatus.NOT_FOUND);
    }
    const { fileKey, mimeType, provider } = fileInfo;
    res.setHeader('Content-Type', mimeType);
    // const fileStream = await this.localStorageService.retirveFile(fileKey);
    const fileStream = (await this.retriveFile(fileKey, this.provider)) as any;
    if (!fileStream) {
      exception(
        'The specified key does not exist on storage location',
        HttpStatus.NOT_FOUND,
      );
    }
    return fileStream.pipe(res);
    // return { fileStream, mimeType };
  }

  private async handleUpload(
    file: Express.Multer.File,
  ): Promise<IUploadedData> {
    if (this.provider === ProviderEnum.LOCAL) {
      return await this.localStorageService.multerUpload(file);
    } else if (this.provider === ProviderEnum.S3_BUCKET) {
      return await this.cloudStorageService.uploadToS3(file);
    } else {
    }
    return null;
  }

  private async retriveFile(fileKey: string, provider: ProviderEnum) {
    switch (provider) {
      case ProviderEnum.LOCAL: {
        return await this.localStorageService.retirveFile(fileKey);
      }
      case ProviderEnum.S3_BUCKET: {
        return await this.cloudStorageService.getFromS3(fileKey);
      }
    }
  }
}
