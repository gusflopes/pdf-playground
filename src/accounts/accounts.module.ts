import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Account } from './entities/account.entity';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [Account] })],
  // exports: [AccountsService],
  controllers: [AccountsController],
  providers: [AccountsService],
})
export class AccountsModule {}
