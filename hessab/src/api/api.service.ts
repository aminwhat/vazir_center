import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';

@Injectable()
export class ApiService {
  constructor(private dbService: DbService) {}

  async comming_soon(phoneNumber: string, ip: string, request_ip: string) {
    console.log({ phoneNumber, ip, request_ip });

    await this.dbService.createCommingSoon({
      phoneNumber,
      ip,
      request_ip,
    });
  }

  async get_release(): Promise<{
    version: string;
    download_uri: string;
    date_release: string;
    file_size: string;
    os: string;
    access: string;
  }> {
    const release = await this.dbService.getRelease();
    return {
      version: release.version,
      download_uri: release.download_uri,
      access: release.options.access,
      date_release: release.options.date_release,
      file_size: release.options.file_size,
      os: release.options.os,
    };
  }
}
