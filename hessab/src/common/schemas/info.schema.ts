import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type InfoDocument = HydratedDocument<Info>;

@Schema({ autoIndex: true })
export class Info {
  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  uri: string;
}

export const InfoSchema = SchemaFactory.createForClass(Info);
