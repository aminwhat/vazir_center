import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as jalaali from 'jalaali-js';
import { JalaaliDateObject } from 'jalaali-js';

export type LogDocument = HydratedDocument<Log>;

@Schema()
export class Log {
  @Prop()
  message: string;

  @Prop({
    type: {
      jy: Number,
      jm: Number,
      jd: Number,
    },
    default: jalaali.toJalaali(new Date()),
    index: true,
  })
  createdDate: JalaaliDateObject;

  @Prop({ default: new Date().toLocaleTimeString() })
  createdTime: string;
}

export const LogSchema = SchemaFactory.createForClass(Log);
