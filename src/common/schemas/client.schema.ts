import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ClientDocument = HydratedDocument<Client>;

@Schema()
export class Client {
  @Prop()
  name: string;

  @Prop({ required: true, unique: true })
  token: string;

  @Prop({ required: true, unique: true })
  version: string;

  @Prop({ required: true, index: true, unique: true })
  version_index: number;

  @Prop({ required: true })
  download_uri: string;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
