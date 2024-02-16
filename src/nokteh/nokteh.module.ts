import { Module } from '@nestjs/common';
import { NoktehGateway } from './nokteh.gateway';
import { NoktehService } from './nokteh.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([], 'nokteh')],
  providers: [NoktehGateway, NoktehService],
})
export class NoktehModule {}
