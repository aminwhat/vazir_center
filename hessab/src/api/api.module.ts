import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { HessabdbModule } from 'src/hessabdb/hessabdb.module';

@Module({
  imports: [HessabdbModule],
  providers: [ApiService],
  controllers: [ApiController],
})
export class ApiModule {}
