import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PdfParserDto } from './dto/pdf-parser.dto';
import { ReceiptsService } from './receipts.service';

@Controller('receipts')
export class ReceiptsController {
  constructor(private readonly receiptsService: ReceiptsService) {}

  @Get()
  findAll() {
    return 'Find all';
  }

  // @Post()
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadFile(
  //   @Body() { parser }: PdfParserDto,
  //   @UploadedFile() file: Express.Multer.File,
  // ) {
  //   return await this.receiptsService.readFile(file, parser, true);
  //   // return await this.receiptsService.readFile(file, parser, true);
  // }

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @Body() { bank, account, parser }: PdfParserDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    console.log(files);
    // console.log(dto);
    const transactions = await this.receiptsService.readFiles({
      files,
      parser,
    });
    return { bank, account, transactions };
  }

  // create(@Body() createReceiptDto: any) {
  //   console.log(createReceiptDto);
  //   // instead of any use the Dto
  //   return createReceiptDto;
  // }
}
