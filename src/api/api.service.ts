import { Injectable } from '@nestjs/common';
import { HessabdbService } from 'src/hessabdb/hessabdb.service';

@Injectable()
export class ApiService {
  constructor(private hessabDbService: HessabdbService) {}

  async comming_soon(phoneNumber: string, ip: string, request_ip: string) {
    console.log({ phoneNumber, ip, request_ip });

    await this.hessabDbService.createCommingSoon({
      phoneNumber,
      ip,
      request_ip,
    });
  }
}
