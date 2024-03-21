import { Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { Client, User } from 'src/common/schemas';
import { DbService } from 'src/db/db.service';

@Injectable()
export class V0Service {
  constructor(private dbService: DbService) {}

  async versionValid(
    version: string,
    token: string,
  ): Promise<{ versionExists: boolean; nextVersion?: Client }> {
    console.log({ version, token });
    return await this.dbService.versionExists(version, token);
  }

  async updateExists(
    version: string,
    token: string,
  ): Promise<{ update?: Client }> {
    const { nextVersion } = await this.dbService.versionExists(version, token);
    return { update: nextVersion };
  }

  async getInfo(key: string): Promise<string> {
    return await this.dbService.getInfo(key);
  }

  async getUserInfoById(user_id: string): Promise<FilterQuery<User>> {
    const { succeed, data } = await this.dbService.getUser({
      _id: user_id,
    });
    if (succeed) {
      return data;
    }
  }
}
