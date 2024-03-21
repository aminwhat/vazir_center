import { Module } from '@nestjs/common';
import { V0Service } from './v0.service';
import { V0Gateway } from './v0.gateway';
import { HessabdbModule } from 'src/hessabdb/hessabdb.module';

@Module({
  imports: [HessabdbModule],
  providers: [V0Service, V0Gateway],
})
export class V0Module {}
