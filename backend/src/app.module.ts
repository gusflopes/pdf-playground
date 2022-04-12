import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReceiptsModule } from './receipts/receipts.module';
import { AccountsModule } from './accounts/accounts.module';
import { PrismaModule } from 'nestjs-prisma';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import config from 'src/common/configs/config';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { BatchesModule } from './batches/batches.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        // import { loggingMiddleware } from 'src/common/middlewares/logging.middleware';
        // middlewares: [loggingMiddleware()], // prisma middleware?
      },
    }),
    RouterModule.register([
      {
        path: 'accounts',
        module: AccountsModule,
        children: [{ path: ':id/batches', module: BatchesModule }],
      },
    ]),
    UsersModule,
    ReceiptsModule,
    AccountsModule,
    AuthModule,
    BatchesModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
