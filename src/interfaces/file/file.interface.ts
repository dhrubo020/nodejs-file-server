export interface IFile {
  id?: string;
  mimeType: string;
  fileKey: string;
  privateKey: string;
  publicKey: string;
  createdAt?: Date;
  updatedAt?: Date;
}
