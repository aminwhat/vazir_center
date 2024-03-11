import { Module } from '@nestjs/common';
import { HessabService } from './hessab.service';
import { HessabGateway } from './hessab.gateway';
import { HessabdbModule } from 'src/hessabdb/hessabdb.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [HessabdbModule, CacheModule.register()],
  providers: [HessabService, HessabGateway],
})
export class HessabModule {}
