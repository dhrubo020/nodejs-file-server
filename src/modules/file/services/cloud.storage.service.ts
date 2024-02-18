import {
  GetObjectCommand,
  PutObjectCommand,
  S3,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { providerConfig } from 'config';
import { IUploadedData } from 'src/interfaces';
import * as fs from 'fs';

@Injectable()
export class S3Service {}
@Injectable()
export class CloudStorageService {
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

  async uploadToS3(file: Express.Multer.File): Promise<IUploadedData> {
    let result: IUploadedData = {
      success: false,
      fileKey: null,
      message: '',
    };
    const s3uploadParams = {
      Bucket: this.bucketName,
      Key: file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    // upload to s3 bucket
    const uploadCommand = new PutObjectCommand(s3uploadParams);
    const uploaded = await this.s3Client.send(uploadCommand);
    if (!uploaded || !uploaded.ETag) {
      return { ...result, message: 'Can not upload to s3' };
    }
    return { ...result, success: true, fileKey: uploaded.ETag };
  }

  async getFromS3(fileKey: string) {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: fileKey,
      };
      const command = new GetObjectCommand(params);
      const data = await this.s3Client.send(command);
      if (!data || !data?.Body) {
        return null;
      }
      return data.Body;
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }
}
