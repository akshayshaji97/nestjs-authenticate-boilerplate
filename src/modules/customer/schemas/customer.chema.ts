import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from 'src/common/schemas/baseschema';

@Schema()
export class Customer extends BaseSchema {
  @Prop(String)
  name: string;

  @Prop(String)
  email: string;

  @Prop(String)
  phone: string;
}

export type CustomerDocument = Customer & Document;
export const CustomerSchema = SchemaFactory.createForClass(Customer);
CustomerSchema.set('timestamps', true);
