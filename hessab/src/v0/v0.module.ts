import { Module } from '@nestjs/common';
import { V0Service } from './v0.service';
import { V0Gateway } from './v0.gateway';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  providers: [V0Service, V0Gateway],
})
export class V0Module {}
