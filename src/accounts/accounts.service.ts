import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { MikroORM } from '@mikro-orm/core';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Account } from './entities/account.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
// import { AccountsRepository } from './accounts.repository';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: EntityRepository<Account>,
  ) {}

  async create(createAccountDto: CreateAccountDto) {
    const account = this.accountRepository.create(createAccountDto);
    this.accountRepository.persist(account);
    await this.accountRepository.flush();
    console.log(account);
    return account;
  }

  async findAll() {
    const accounts = this.accountRepository.findAll();
    return accounts;
  }

  async findOne(id: number) {
    const account = await this.accountRepository.findOne({ id });
    return account;
  }

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${id} account`;
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }
}
