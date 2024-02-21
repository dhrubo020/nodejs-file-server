import { Test, TestingModule } from '@nestjs/testing';
import { DBFileRepository } from 'src/modules/file/repositories/db.file.repository';
import { IStorageRepository } from 'src/modules/file/repositories/types.repository';
import { FileUploadService } from 'src/modules/file/services/file.upload.services';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { IFileUploadRes } from 'src/interfaces';

describe('FileUploadService', () => {
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

  describe('uploadFiles', () => {
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
      console.log({ response });
      data = response.data;
      expect(response.success).toBe(true);
    });

    it.only('If file delete is unsuccessfull', async () => {
      await expect(
        async () => await fileService.deleteFile('wrongKey'),
      ).rejects.toThrow();
    });

    it('If file delete is successfull', async () => {
      const response = await fileService.deleteFile(data.privateKey);
      expect(response.data.message).toEqual(
        'File has been deleted successfully',
      );
    });

    // it('should upload file and save file info', async () => {
    //   const mockResponse = successResponse({
    //     privateKey: 'mockPrivateKey',
    //     publicKey: 'mockPublicKey',
    //   });

    //   storageRepository.upload = jest
    //     .fn()
    //     .mockResolvedValue({ success: false });
    //   dbFileRepository.saveFileInfo = jest.fn().mockResolvedValue(false);

    //   const result = await fileService.uploadFiles(mockFile);

    //   expect(result).toEqual(mockResponse);
    //   expect(storageRepository.upload).toHaveBeenCalledWith(mockFile);
    //   expect(dbFileRepository.saveFileInfo).toHaveBeenCalledWith({
    //     fileKey: mockFile.originalname,
    //     mimeType: mockFile.mimetype,
    //     privateKey: 'mockPrivateKey',
    //     publicKey: 'mockPublicKey',
    //     provider: fileService['provider'],
    //   });
    // });

    // it('should throw error if file upload fails', async () => {
    //   const mockFile = {} as any;

    //   storageRepository.upload = jest
    //     .fn()
    //     .mockResolvedValue({ success: false, message: 'Upload failed' });

    //   await expect(fileService.uploadFiles(mockFile)).rejects.toThrowError(
    //     'Upload failed',
    //   );
    // });
  });

  // Add more test cases for other methods such as getFile and deleteFile
});
