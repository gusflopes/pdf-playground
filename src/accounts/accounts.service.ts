import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsService {
  // constructor(
  //   @InjectRepository(Account)
  //   private accountRepository: EntityRepository<Account>,
  // ) {}

  async create(createAccountDto: CreateAccountDto) {
    return `This action create an account`;
  }

  async findAll() {
    return `This action finds all accounts`;
  }

  async findOne(id: number) {
    return `This action finds an #${id} account`;
  }

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return `This action updates an #${id} account`;
  }

  remove(id: number) {
    return `This action removes an #${id} account`;
  }
}
