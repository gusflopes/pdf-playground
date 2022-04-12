import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Res,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { User as IUser } from '@prisma/client';
import { Request as ExpRequest, Response } from 'express';
import { User } from 'src/common/decorators/user.decorator';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Controller()
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  create(
    @Body() createAccountDto: CreateAccountDto,
    @User('id') userId: string,
  ) {
    return this.accountsService.create(createAccountDto, userId);
  }

  @Get()
  findAll(@Request() req: ExpRequest, @User() user: IUser) {
    // console.log(req.user);
    // console.log('-----');
    // console.log(user.id);

    return this.accountsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User('id') userId: string) {
    return this.accountsService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
    @User('id') userId,
  ) {
    return this.accountsService.update(id, updateAccountDto, userId);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @User('id') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const deleted = await this.accountsService.remove(id, userId);
    if (!deleted) {
      throw new InternalServerErrorException();
    }
    res.status(HttpStatus.NO_CONTENT);
    return [];
  }
}
