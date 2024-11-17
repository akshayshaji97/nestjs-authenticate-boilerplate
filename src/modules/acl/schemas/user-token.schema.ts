import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema()
export class UserToken {
  @Prop(Types.ObjectId)
  userId: Types.ObjectId;

  @Prop(String)
  token: string;

  @Prop({ required: true, type: Object })
  apiPermissions?: any;

  @Prop(String)
  role?: string;

  @Prop(Date)
  expireAt?: Date;
}

export type UserTokenDocument = UserToken & Document;

export const UserTokenSchema = SchemaFactory.createForClass(UserToken);
UserTokenSchema.set('timestamps', true);
UserTokenSchema.index({ createdAt: 1, updateßdAt: 1 });
UserTokenSchema.index({ userId: 1, token: 1, expireAt: 1 });
