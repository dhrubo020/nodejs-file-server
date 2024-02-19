import { Bucket, Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { providerConfig } from 'config';
import { IUploadedData } from 'src/interfaces';
import { IStorageRepository } from './types.repository';
import { Stream } from 'stream';

@Injectable()
export class GCPRepository implements IStorageRepository {
  private storage: Storage;
  private readonly bucketName: string;
  private readonly bucket: Bucket;

  constructor() {
    this.bucketName = providerConfig.gcpBucketConfig.name;
    // Create a client that uses Application Default Credentials
    this.storage = new Storage();
    this.bucket = this.storage.bucket(this.bucketName);

    // Create a client with explicit credentials
    // this.storage = new Storage({
    //   projectId: 'your-project-id',
    //   keyFilename: '/path/to/keyfile.json',
    // });
  }

  async upload(file: Express.Multer.File): Promise<IUploadedData> {
    let result: IUploadedData = {
      success: false,
      fileKey: null,
      message: '',
    };
    try {
      return new Promise((resolve, reject) => {
        console.log({ file });

        const fileStream = this.bucket.file(file.originalname);
        const passthroughStream = new Stream.PassThrough();
        passthroughStream.write(file.buffer);
        passthroughStream.end();
        passthroughStream
          .pipe(fileStream.createWriteStream())
          .on('finish', () => {
            // The file upload is complete
            resolve({ ...result, success: true, fileKey: file.originalname });
          })
          .on('error', (error) => {
            console.log(error);
            resolve({
              success: false,
              fileKey: null,
              message: 'Can not upload to gcp storage',
            });
          });
      });
    } catch (error) {
      console.log(error);
      return {
        success: false,
        fileKey: null,
        message: 'Can not upload to gcp storage',
      };
    }
  }

  async retrive(fileKey: string): Promise<any> {
    try {
      return new Promise((resolve, reject) => {
        const file = this.bucket.file(fileKey);
        console.log(file);
        if (!file || !file?.baseUrl) {
          resolve(null);
        }
        const readStream = file.createReadStream();
        readStream.on('error', (error) => {
          console.log(error);
          resolve(null);
        });
        resolve(readStream);
      });
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }

  async delete(fileKey: string): Promise<boolean> {
    const file = this.bucket.file(fileKey);
    try {
      const isDeleted = await file.delete();
      console.log({ isDeleted });
      console.log('File deleted successfully');
      return true;
    } catch (error) {
      console.log('Error deleting file from gcp bucket:', error.message);
      return false;
    }
  }
}
