import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as jalaali from 'jalaali-js';
import { JalaaliDateObject } from 'jalaali-js';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  nationalId: string;

  @Prop()
  email: string;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop({
    type: {
      jy: Number,
      jm: Number,
      jd: Number,
    },
    default: jalaali.toJalaali(new Date()),
    index: true,
  })
  createdDate?: JalaaliDateObject;
}

export const UserSchema = SchemaFactory.createForClass(User);
