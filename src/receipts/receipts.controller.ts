import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReceiptsService } from './receipts.service';

@Controller('receipts')
export class ReceiptsController {
  constructor(private readonly receiptsService: ReceiptsService) {}

  @Get()
  findAll() {
    return 'Find all';
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Body() fields: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(file);
    console.log(fields);
    return await this.receiptsService.readFile(file);
  }

  // create(@Body() createReceiptDto: any) {
  //   console.log(createReceiptDto);
  //   // instead of any use the Dto
  //   return createReceiptDto;
  // }
}
