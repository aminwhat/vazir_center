import { Module } from '@nestjs/common';
import { NoktehGateway } from './nokteh.gateway';
import { NoktehService } from './nokteh.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Log, LogSchema } from 'src/common/schemas';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Log.name, schema: LogSchema }],
      'nokteh',
    ),
  ],
  providers: [NoktehGateway, NoktehService],
})
export class NoktehModule {}
