import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from 'src/database/entities/file.entity';
import { IFile } from 'src/interfaces';
import { Repository } from 'typeorm';
import { AbsFileRepository } from './abstract.repository';

@Injectable()
export class FileRepository implements AbsFileRepository {
  constructor(
    @InjectRepository(FileEntity)
    private fileOrmRepository: Repository<FileEntity>,
  ) {}
  async saveFileInfo(data: IFile): Promise<IFile> {
    try {
      data = this.fileOrmRepository.create(data);
      return await this.fileOrmRepository.save(data);
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }

  async getFileInfo(publicKey: string): Promise<IFile> {
    try {
      return await this.fileOrmRepository.findOneBy({ publicKey });
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }

  async deleteFileInfo(privateKey: string): Promise<IFile> {
    try {
      const isExist = await this.fileOrmRepository.findOneBy({ privateKey });
      const isDeleted =
        isExist && (await this.fileOrmRepository.delete({ privateKey }));
      console.log({ isDeleted });
      return isExist;
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }
}
