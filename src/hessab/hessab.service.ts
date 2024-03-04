import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { Client, User } from 'src/common/schemas';
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

  async getUserSession(user_id: string): Promise<{
    succeed: boolean;
    data?: { lastSeen: Date };
    message?: string;
  }> {
    const userSession: { lastSeen: Date } = await this.cacheManager.get(
      `Session:${user_id}`,
    );

    if (!userSession) {
      return { succeed: false, message: 'The userSession does not exists' };
    }

    return { succeed: true, data: userSession };
  }

  async setUserSession(user_id: string) {
    await this.cacheManager.set(
      `Session:${user_id}`,
      { lastSeen: new Date().toUTCString() },
      2600,
    );
  }

  async getUserInfoById(user_id: string): Promise<FilterQuery<User>> {
    const { succeed, data } = await this.hessabdbService.getUser({
      _id: user_id,
    });
    if (succeed) {
      return data;
    }
  }
}
