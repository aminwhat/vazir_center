import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log } from 'src/common/schemas';

@Injectable()
export class NoktehService implements OnModuleInit {
  async onModuleInit() {
    const log = await this.logModel.findOne().exec();
    if (!log) {
      const newLog = new this.logModel({ message: 'Database Created: hessab' });
      await newLog.save();
    }
  }

  constructor(@InjectModel(Log.name, 'nokteh') private logModel: Model<Log>) {}
}
