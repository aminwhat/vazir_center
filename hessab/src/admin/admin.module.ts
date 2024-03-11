import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminGateway } from './admin.gateway';

@Module({
  providers: [AdminService, AdminGateway],
})
export class AdminModule {}
