import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type JobDocument = HydratedDocument<Job>;

@Schema({ timestamps: true })
export class Job {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  skills: string[];

  @Prop({ required: true })
  location: string;
  @Prop({ required: true })
  salary: string;
  @Prop({ required: true })
  quantity: number;
  @Prop({ required: true })
  level: string;
  @Prop({ required: true })
  description: string;
  @Prop({ type: Object })
  company: {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    logo: string;
  };
  @Prop({ required: true })
  startDate: Date;
  @Prop({ required: true })
  endDate: Date;
  @Prop({ required: true })
  isActive: boolean;
  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
  };
  @Prop({ type: Object })
  UpdatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop()
  createdAt: Date;
  @Prop()
  updatedAt: Date;
  @Prop()
  isDeleted: boolean;
  @Prop()
  detetedAt: Date;
}

export const JobSchema = SchemaFactory.createForClass(Job);
