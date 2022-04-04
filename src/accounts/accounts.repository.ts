import { EntityRepository } from '@mikro-orm/postgresql';
import { Account } from './entities/account.entity';

export class AccountsRepository extends EntityRepository<Account> {}
