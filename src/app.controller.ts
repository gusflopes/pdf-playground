import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AppService } from './app.service';
import { PublicRoute } from './common/decorators/public-route.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @PublicRoute()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getProtected(): string {
    return this.appService.getHello();
  }
}
