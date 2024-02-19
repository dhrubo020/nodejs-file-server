import { IFile, IUploadedData } from 'src/interfaces';

export abstract class AbstractDBFileRepository {
  abstract saveFileInfo(data: IFile): Promise<IFile | null>;
  abstract getFileInfo(publicKey: string): Promise<IFile | null>;
  abstract deleteFileInfo(privateKey: string): Promise<IFile | null>;
}

export interface IStorageRepository {
  upload(file: Express.Multer.File): Promise<IUploadedData>;
  retrive(fileKey: string): Promise<any>;
  delete(fileKey: string): Promise<boolean>;
}
