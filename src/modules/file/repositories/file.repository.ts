import { Injectable } from '@nestjs/common';
import { IFile } from 'src/interfaces';
import { FileModel } from 'src/mongodb';

@Injectable()
export class FileRepository {
  async saveFileInfo(data: IFile): Promise<IFile> {
    try {
      return await (await FileModel.create(data)).toObject();
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }

  async getFileInfo(publicKey: string): Promise<IFile> {
    try {
      return await FileModel.findOne({ publicKey }).select('-_id').lean();
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }

  async deleteFileInfo(privateKey: string): Promise<IFile> {
    try {
      return await FileModel.findOneAndDelete({ privateKey })
        .select('-_id')
        .lean();
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }
}
