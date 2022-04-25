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
  NotFoundException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { BatchesService } from './batches.service';
import { CreateBatchDto } from './dto/create-batch.dto';
// import { PrismaService } from 'nestjs-prisma';
import { AccountsService } from '../accounts/accounts.service';
import { User } from 'src/common/decorators/user.decorator';

@Controller()
export class BatchesController {
  constructor(
    private readonly batchesService: BatchesService,
    private readonly accountsService: AccountsService,
  ) {}

  @Get()
  async listBatches(
    @Param('id') accountId: string,
    @User('id') userId: string,
  ): Promise<any> {
    const account = await this.accountsService.findOne(accountId, userId);
    if (!account) throw new NotFoundException('account not found');
    // return account;

    const batches = await this.batchesService.index(account.id);
    return batches;
  }

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @Body() payload: CreateBatchDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('id') accountId,
    @User('id') userId: string,
  ): Promise<any> {
    // console.log(files);
    // console.log(payload);
    console.log(accountId);

    const account = await this.accountsService.findOne(accountId, userId);
    if (!account) throw new NotFoundException('account not found');
    // return account;

    console.log('payload: ', payload);

    const response = await this.batchesService.handle({
      data: { account_id: account.id, ...payload },
      files,
      scope: userId,
      raw: true,
    });

    return response;
  }
}
