import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';

export type TokenDocument = HydratedDocument<Token>;

@Schema({ autoIndex: true })
export class Token {
  @Prop()
  user_id?: string;

  @Prop({ type: ObjectId, required: true })
  client_id: string;

  @Prop({ type: String, required: true })
  appVersion: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
