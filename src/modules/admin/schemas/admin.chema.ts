import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from 'src/common/schemas/baseschema';

@Schema()
export class Admin extends BaseSchema {
  @Prop(String)
  name: string;

  @Prop(String)
  email: string;

  @Prop(String)
  phone: string;
}

export type AdminDocument = Admin & Document;
export const AdminSchema = SchemaFactory.createForClass(Admin);
AdminSchema.set('timestamps', true);
