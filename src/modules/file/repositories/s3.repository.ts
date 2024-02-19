import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { providerConfig } from 'config';
import { IUploadedData } from 'src/interfaces';
import { IStorageRepository } from './types.repository';

@Injectable()
export class S3Repository implements IStorageRepository {
  private s3Client: S3;
  private bucketName: string;
  constructor() {
    const {
      aws_s3_apiVersion,
      aws_s3_bucketName,
      aws_accessKeyId,
      aws_secretAccessKey,
      aws_region,
    } = providerConfig.s3BucketConfig;

    this.bucketName = aws_s3_bucketName;
    this.s3Client = new S3([
      {
        apiVersion: aws_s3_apiVersion,
        accessKeyId: aws_accessKeyId,
        secretAccessKey: aws_secretAccessKey,
        region: aws_region,
      },
    ]);
  }

  async upload(file: Express.Multer.File): Promise<IUploadedData> {
    let result: IUploadedData = {
      success: false,
      fileKey: null,
      message: '',
    };
    try {
      const s3uploadParams = {
        Bucket: this.bucketName,
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      // upload to s3 bucket
      const uploaded = await this.s3Client.send(
        new PutObjectCommand(s3uploadParams),
      );
      return { ...result, success: true, fileKey: uploaded.ETag };
    } catch (error) {
      console.log(error.message);
      return { ...result, message: 'Can not upload to s3' };
    }
  }

  async retrive(fileKey: string): Promise<any> {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: fileKey,
      };
      const data = await this.s3Client.send(new GetObjectCommand(params));
      if (!data || !data?.Body) {
        return null;
      }
      return data.Body;
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }

  async delete(fileKey: string): Promise<boolean> {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: fileKey,
      };
      await this.s3Client.send(new DeleteObjectCommand(params));
      return true;
    } catch (error) {
      console.error('Error deleting file:', error.message);
      return false;
    }
  }
}
