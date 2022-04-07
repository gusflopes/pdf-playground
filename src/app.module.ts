import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReceiptsModule } from './receipts/receipts.module';
import { AccountsModule } from './accounts/accounts.module';

@Module({
  imports: [UsersModule, ReceiptsModule, AccountsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
