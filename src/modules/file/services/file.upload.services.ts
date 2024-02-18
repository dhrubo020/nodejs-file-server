import { HttpStatus, Injectable, Res } from '@nestjs/common';
import { providerConfig } from 'config';
import { randomUUID } from 'crypto';
import { Response } from 'express';
import { IFileUploadRes, IUploadedData } from 'src/interfaces';
import { exception, IServiceResponse, successResponse } from 'src/utils';
import { FileRepository } from '../repositories/file.repository';
import { LocalStorageService } from './local.storage.service';

@Injectable()
export class FileUploadService {
  constructor(
    private readonly localStorageService: LocalStorageService,
    private readonly fileRepository: FileRepository,
  ) {}

  private async handleUpload(
    file: Express.Multer.File,
  ): Promise<IUploadedData> {
    if (providerConfig.name === 'LOCAL') {
      return await this.localStorageService.multerUpload(file);
    } else {
    }
    return null;
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
    const { fileKey, mimeType } = fileInfo;
    res.setHeader('Content-Type', mimeType);
    const fileStream = await this.localStorageService.retirveFile(fileKey);
    return fileStream.pipe(res);
    // return { fileStream, mimeType };
  }
}
