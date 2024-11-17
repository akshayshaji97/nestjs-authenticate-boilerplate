import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ppid } from 'process';
import { UserTypes } from 'src/common/enums';
import { BaseSchema } from 'src/common/schemas/baseschema';

@Schema()
export class Vendor extends BaseSchema {
  @Prop(String)
  name: string;

  @Prop(String)
  email: string;

  @Prop(String)
  phone: string;

  @Prop(String)
  hashedPassword: string;

  @Prop(UserTypes)
  role: UserTypes;

  @Prop({ type: Boolean, default: false })
  emailVerified: boolean;

  @Prop({ type: Boolean, default: false })
  phoneVerified: boolean;

  @Prop(Boolean)
  isActive: boolean;
}

export type VendorDocument = Vendor & Document;
export const VendorSchema = SchemaFactory.createForClass(Vendor);
VendorSchema.set('timestamps', true);
