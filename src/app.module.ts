import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReceiptsModule } from './receipts/receipts.module';
import { AccountsModule } from './accounts/accounts.module';
import { PrismaModule } from 'nestjs-prisma';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import config from 'src/common/configs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        // import { loggingMiddleware } from 'src/common/middleware/logging.middleware';
        // middlewares: [loggingMiddleware()], // prisma middleware?
      },
    }),
    UsersModule,
    ReceiptsModule,
    AccountsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
