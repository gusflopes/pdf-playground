import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { BatchesService } from './batches.service';
import { CreateBatchDto } from './dto/create-batch.dto';

@Controller()
export class BatchesController {
  constructor(private readonly batchesService: BatchesService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @Body() payload: CreateBatchDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    console.log(files);
    console.log(payload);

    const response = await this.batchesService.handle({
      data: payload,
      files,
      scope: 'clientId',
    });
    // console.log(dto);
    // const transactions = await this.receiptsService.readFiles({
    //   files,
    //   parser,
    // });
    // return { bank, account, transactions };
    return response;
  }
}
