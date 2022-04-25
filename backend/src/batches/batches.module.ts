import { Module } from '@nestjs/common';
import { BatchesService } from './batches.service';
import { BatchesController } from './batches.controller';
import { AccountsService } from 'src/accounts/accounts.service';
import { AccountsModule } from 'src/accounts/accounts.module';

@Module({
  imports: [],
  controllers: [BatchesController],
  providers: [BatchesService, AccountsService],
})
export class BatchesModule {}
