import { Injectable } from '@nestjs/common';
import { providerConfig } from 'config';
import * as fs from 'fs';
import { join } from 'path';
import { IUploadedData } from 'src/interfaces';

@Injectable()
export class LocalStorageService {
  private folder = providerConfig.localBucketConfig.location;

  private getFilePath(key: string): string {
    const uploadDir = `${this.folder}`;
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const filePath = join(uploadDir, key);
    return filePath;
  }

  async multerUpload(file: Express.Multer.File): Promise<IUploadedData> {
    let result: IUploadedData = {
      success: false,
      fileKey: null,
      message: '',
    };
    try {
      return new Promise((resolve, reject) => {
        const key = file.originalname;
        const filePath = this.getFilePath(key);
        const fileStream = fs.createWriteStream(filePath);
        fileStream.on('error', (err) => {
          console.log(err);
          resolve({
            ...result,
            message: 'Can not upload image in local storage',
          });
        });
        fileStream.on('finish', () => {
          resolve({
            success: true,
            fileKey: key,
            message: '',
          });
        });
        fileStream.write(file.buffer);
        fileStream.end();
      });
    } catch (error) {
      console.log(error.message);
      return { ...result, message: error.message };
    }
  }

  async retirveFile(key: string): Promise<fs.ReadStream> {
    const filePath = this.getFilePath(key);
    return new Promise((resolve, reject) => {
      const fileStream = fs.createReadStream(filePath);
      fileStream.on('error', (error) => {
        reject(error);
      });
      fileStream.on('open', () => {
        resolve(fileStream);
      });
    });
  }
}
