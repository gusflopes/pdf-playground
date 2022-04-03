import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReceiptsController } from './receipts/receipts.controller';
import { ReceiptsModule } from './receipts/receipts.module';

@Module({
  imports: [MikroOrmModule.forRoot(), UsersModule, ReceiptsModule],
  controllers: [AppController, ReceiptsController],
  providers: [AppService],
})
export class AppModule {}
