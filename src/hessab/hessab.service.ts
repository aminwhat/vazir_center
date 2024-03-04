import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'src/common/schemas';
import { HessabdbService } from 'src/hessabdb/hessabdb.service';

@Injectable()
export class HessabService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private hessabdbService: HessabdbService,
  ) {}

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

  async getInfo(key: string): Promise<string> {
    return await this.hessabdbService.getInfo(key);
  }
}
