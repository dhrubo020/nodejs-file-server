import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { FileUploadService } from '../services/file.upload.services';

@Controller('files')
@ApiTags('Files API')
export class AdminMediaController {
  constructor(private fileUploadService: FileUploadService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingleFileByAdmin(
    @UploadedFile('file') file: Express.Multer.File,
  ) {
    console.log(file);
    return this.fileUploadService.uploadFiles(file);
  }

  @Get('/:publicKey')
  async getFile(@Param('publicKey') key: string, @Res() res: Response) {
    // const { fileStream, mimeType } = await this.fileUploadService.getFile(
    //   key,
    //   res,
    // );
    // res.setHeader('Content-Type', mimeType);
    // fileStream.pipe(res);
    return await this.fileUploadService.getFile(key, res);
  }
}
