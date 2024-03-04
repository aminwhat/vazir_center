import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as jalaali from 'jalaali-js';
import { JalaaliDateObject } from 'jalaali-js';

export type UserDocument = HydratedDocument<User>;

@Schema({ autoIndex: true })
export class User {
  @Prop()
  name: string;

  @Prop({ unique: true })
  phoneNumber: string;

  @Prop({ unique: true })
  nationalId: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ unique: true })
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
  })
  createdDate?: JalaaliDateObject;
}

export const UserSchema = SchemaFactory.createForClass(User);
