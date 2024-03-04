import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ClientDocument = HydratedDocument<Client>;

@Schema({ autoIndex: true })
export class Client {
  @Prop()
  name: string;

  @Prop({ required: true, unique: true })
  token: string;

  @Prop({ required: true, unique: true })
  version: string;

  @Prop({ required: true, unique: true })
  version_index: number;

  @Prop({ required: true })
  download_uri: string;

  @Prop({
    required: true,
    type: {
      release_log_uri: String,
      date_release: String,
      file_size: String,
      os: String,
      access: String,
    },
  })
  options: {
    release_log_uri: string;
    date_release: string;
    file_size: string;
    os: string;
    access: string;
  };
}

export const ClientSchema = SchemaFactory.createForClass(Client);
