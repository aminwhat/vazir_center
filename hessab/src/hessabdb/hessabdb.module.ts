import { Global, Module } from '@nestjs/common';
import { HessabdbService } from './hessabdb.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Log,
  LogSchema,
  Client,
  ClientSchema,
  Project,
  ProjectSchema,
  CommingSoon,
  CommingSoonSchema,
  Info,
  InfoSchema,
  User,
  UserSchema,
} from 'src/common/schemas';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Client.name, schema: ClientSchema },
        { name: Log.name, schema: LogSchema },
        { name: Project.name, schema: ProjectSchema },
        { name: CommingSoon.name, schema: CommingSoonSchema },
        { name: Info.name, schema: InfoSchema },
        { name: User.name, schema: UserSchema },
      ],
      'hessab',
    ),
  ],
  providers: [HessabdbService],
  exports: [HessabdbService],
})
export class HessabdbModule {}
