import { Body, Controller, Ip, Post } from '@nestjs/common';
import { ApiService } from './api.service';
import { CommingSoonDto } from './dto';

@Controller('api')
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
}
