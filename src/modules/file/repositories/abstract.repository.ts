import { IFile } from 'src/interfaces';

export abstract class AbsFileRepository {
  abstract saveFileInfo(data: IFile): Promise<IFile | null>;
  abstract getFileInfo(publicKey: string): Promise<IFile | null>;
  abstract deleteFileInfo(privateKey: string): Promise<IFile | null>;
}
