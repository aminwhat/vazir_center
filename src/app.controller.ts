import { Controller, Get, Redirect } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Get()
  @Redirect('https://vazir.io', 302)
  getApi() {}

  @Get('version')
  async getServerVersion() {
    return await this.appService.getServerVersion();
  }
}
