export interface IFile {
  id?: string;
  mimeType: string;
  fileKey: string;
  privateKey: string;
  publicKey: string;
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
