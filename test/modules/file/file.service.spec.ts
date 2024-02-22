import { Test, TestingModule } from '@nestjs/testing';
import { DBFileRepository } from 'src/modules/file/repositories/db.file.repository';
import { IStorageRepository } from 'src/modules/file/repositories/types.repository';
import { FileUploadService } from 'src/modules/file/services/file.upload.services';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { IFileUploadRes } from 'src/interfaces';

describe('Initializing Test Module...', () => {
  let fileService: FileUploadService;
  let dbFileRepository: DBFileRepository;
  let storageRepository: IStorageRepository;

  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    fileService = module.get<FileUploadService>(FileUploadService);
    dbFileRepository = module.get<DBFileRepository>(DBFileRepository);
    storageRepository = module.get<IStorageRepository>(
      'STORAGE_REPOSITORY_TOKEN',
    );
  });

  describe('Testing file upload service', () => {
    const validMockFile: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'testFile.txt',
      encoding: '7bit',
      mimetype: 'text/plain',
      buffer: Buffer.from('abcd'),
      size: 4,
    } as any;

    let data: IFileUploadRes;

    it('If file upload is successfull', async () => {
      const response = await fileService.uploadFiles(validMockFile);
      data = response.data;
      expect(response.success).toBe(true);
    });

    it('If file delete will be unsuccessfull for wrongKey', async () => {
      await expect(
        async () => await fileService.deleteFile('wrongKey'),
      ).rejects.toThrow();
    });

    it('If file delete will be successfull using the private key', async () => {
      const response = await fileService.deleteFile(data.privateKey);
      expect(response.data.message).toEqual(
        'File has been deleted successfully',
      );
    });
  });
});
