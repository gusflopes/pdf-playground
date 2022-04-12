import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

interface IAccountsService {
  create: (input: CreateAccountDto, scope: string) => Promise<Account>;
  findAll: (scope: string) => Promise<Account[]>;
  findOne: (id: string, scope: string) => Promise<any>;
  update: (
    id: string,
    payload: UpdateAccountDto,
    scope: string,
  ) => Promise<Account>;
  remove: (id: string, scope: string) => Promise<any>;
}

@Injectable()
export class AccountsService implements IAccountsService {
  constructor(private prisma: PrismaService) {}

  async create(payload: CreateAccountDto, scope: string) {
    const account = await this.prisma.account.create({
      data: {
        user_id: scope,
        ...payload,
      },
    });
    console.log(payload);
    return account;
  }

  async findAll(id: string) {
    return this.prisma.account.findMany({
      where: { user_id: { equals: id } },
    });
  }

  async findOne(id: string, scope: string) {
    return this.prisma.account.findFirst({
      where: {
        id: id,
        AND: {
          user_id: {
            equals: scope,
          },
        },
      },
    });
  }

  async update(id: string, payload: UpdateAccountDto, scope: string) {
    console.log(id);
    const account = await this.prisma.account.findFirst({
      where: {
        id,
        AND: {
          user_id: scope,
        },
      },
    });

    if (!account) {
      throw new NotFoundException(`Couldn't find the account ${id}`);
    }

    return this.prisma.account.update({ where: { id }, data: payload });
  }

  async remove(id: string, scope: string) {
    const account = await this.prisma.account.findUnique({ where: { id } });
    if (!account) {
      throw new NotFoundException(`Couldn't find the account ${id}`);
    }
    console.log('scope: ', scope);
    console.log('user_id: ', account.user_id);
    if (account.user_id !== scope) {
      throw new BadRequestException(`Couldn't find the account ${id}`);
    }
    return this.prisma.account.delete({ where: { id } });
  }
}
