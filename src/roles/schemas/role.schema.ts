import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Permission } from 'src/permissions/schemas/permission.schema';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true })
export class Role {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  description: string[];

  @Prop({ required: true })
  isActive: boolean;
  @Prop({
    required: true,
    type: [mongoose.Schema.Types.ObjectId],
    ref: Permission.name,
  })
  permissions: Permission[];
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

export const RoleSchema = SchemaFactory.createForClass(Role);
