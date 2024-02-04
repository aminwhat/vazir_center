import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as jalaali from 'jalaali-js';
import { JalaaliDateObject } from 'jalaali-js';

export type ProjectDocument = HydratedDocument<Project>;

@Schema()
export class Project {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  companyName: string;

  @Prop({
    type: {
      jy: Number,
      jm: Number,
      jd: Number,
    },
  })
  startDate: JalaaliDateObject;

  @Prop({
    type: {
      jy: Number,
      jm: Number,
      jd: Number,
    },
  })
  endDate: JalaaliDateObject;

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

export const ProjectSchema = SchemaFactory.createForClass(Project);
