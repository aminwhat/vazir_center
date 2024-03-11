import { Injectable } from '@nestjs/common';
import { SERVER_VERSION } from './common/constants';

@Injectable()
export class AppService {
  getServerVersion(): any {
    return SERVER_VERSION;
  }
}
