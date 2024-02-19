import { Body, Controller, Ip, Post, Get } from '@nestjs/common';
import { ApiService } from './api.service';
import { CommingSoonDto } from './dto';

@Controller('v0/api')
export class ApiController {
  constructor(private apiService: ApiService) {}

  @Post('comming-soon')
  async comming_soon(
    @Body() commingSoonDto: CommingSoonDto,
    @Ip() request_ip: string,
  ) {
    await this.apiService.comming_soon(
      commingSoonDto.phoneNumber,
      commingSoonDto.ip,
      request_ip,
    );
  }

  @Get('release')
  async get_release(): Promise<{
    version: string;
    download_uri: string;
    date_release: string;
    file_size: string;
    os: string;
    access: string;
  }> {
    return await this.apiService.get_release();
  }
}
