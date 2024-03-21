import { Module } from '@nestjs/common';
import { HessabService } from './hessab.service';
import { HessabGateway } from './hessab.gateway';
import { HessabdbModule } from 'src/hessabdb/hessabdb.module';

@Module({
  imports: [HessabdbModule],
  providers: [HessabService, HessabGateway],
})
export class HessabModule {}
