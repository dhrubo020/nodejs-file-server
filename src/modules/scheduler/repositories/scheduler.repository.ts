import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from 'src/database/entities/file.entity';
import { IFile } from 'src/interfaces';
import { LessThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class SchedulerRepository {
  constructor(
    @InjectRepository(FileEntity)
    private fileOrmRepository: Repository<FileEntity>,
  ) {}

  async deleteFileInfo(
    date: Date,
    skip: number,
    limit: number,
  ): Promise<IFile[]> {
    try {
      return await this.fileOrmRepository.find({
        where: { createdAt: LessThanOrEqual(date) },
        skip: skip,
        take: limit,
      });
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }

  async totalFileCount(date: Date): Promise<number> {
    try {
      console.log({ date });

      return await this.fileOrmRepository.countBy({
        createdAt: LessThanOrEqual(date),
      });
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }
}
