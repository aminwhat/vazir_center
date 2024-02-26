import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as jalaali from 'jalaali-js';
import { JalaaliDateObject } from 'jalaali-js';

export type ProjectDocument = HydratedDocument<Project>;

@Schema()
export class Project {
  @Prop()
  title: string;

  @Prop()
  description?: string;

  @Prop()
  companyName: string;

  @Prop()
  index: number;

  @Prop({
    type: {
      theType: [
        'ACCOUNTING_SIMPLE',
        'ACCOUNTING_ADVANCED',
        'ACCOUNTING_ENTERPRISE',
      ],
      theTypeTitle: String,
      cloud: Boolean,
    },
  })
  project_type: {
    theType: [
      'ACCOUNTING_SIMPLE',
      'ACCOUNTING_ADVANCED',
      'ACCOUNTING_ENTERPRISE',
    ];
    theTypeTitle: string;
    cloud: boolean;
  };

  @Prop()
  user_id: string;

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
