import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as jalaali from 'jalaali-js';

export type CommingSoonDocument = HydratedDocument<CommingSoon>;

@Schema()
export class CommingSoon {
  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  ip: string;

  @Prop({ required: true })
  request_ip: string;

  @Prop({
    type: {
      jy: Number,
      jm: Number,
      jd: Number,
    },
    default: jalaali.toJalaali(new Date()),
    index: true,
  })
  createdDate: jalaali.JalaaliDateObject;

  @Prop({ default: new Date().toLocaleTimeString() })
  createdTime: string;
}

export const CommingSoonSchema = SchemaFactory.createForClass(CommingSoon);
