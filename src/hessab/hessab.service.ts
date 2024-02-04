import { Injectable } from '@nestjs/common';
import { Client } from 'src/common/schemas';
import { HessabdbService } from 'src/hessabdb/hessabdb.service';

@Injectable()
export class HessabService {
  constructor(private hessabdbService: HessabdbService) {}

  async versionValid(
    version: string,
    token: string,
  ): Promise<{ versionExists: boolean; nextVersion?: Client }> {
    console.log({ version, token });
    return await this.hessabdbService.versionExists(version, token);
  }

  async updateExists(
    version: string,
    token: string,
  ): Promise<{ update?: Client }> {
    const { nextVersion } = await this.hessabdbService.versionExists(
      version,
      token,
    );
    return { update: nextVersion };
  }
}
