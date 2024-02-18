export interface IFile {
  id?: string;
  mimeType: string;
  fileKey: string;
  privateKey: string;
  publicKey: string;
  provider: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IFileUploadRes {
  privateKey: string;
  publicKey: string;
}

export interface IUploadedData {
  success: boolean;
  fileKey: string;
  message?: string;
}

export enum ProviderEnum {
  LOCAL = 'LOCAL',
  S3_BUCKET = 'S3_BUCKET',
  GCP_BUCKET = 'GCP_BUCKET',
  AZURE_BUCKET = 'AZURE_BUCKET',
}
