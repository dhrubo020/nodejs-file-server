import { IFile, ProviderEnum } from 'src/interfaces';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'file-info' })
export class FileEntity implements IFile {
  @PrimaryGeneratedColumn()
  @Index()
  id: number;

  @Column()
  mimeType: string;

  @Column()
  fileKey: string;

  @Column()
  @Index({ unique: true })
  privateKey: string;

  @Column()
  @Index({ unique: true })
  publicKey: string;

  @Column()
  provider: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
