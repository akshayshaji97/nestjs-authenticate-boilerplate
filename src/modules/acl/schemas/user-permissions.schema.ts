import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema()
export class UserPermission {
  @Prop(Types.ObjectId)
  userId: Types.ObjectId;

  @Prop({ required: true, type: Object })
  apiPermissions?: any;

  @Prop(String)
  role?: string;
}

export const UserPermissionSchema =
  SchemaFactory.createForClass(UserPermission);
export type UserPermissionDocument = UserPermission & Document;
UserPermissionSchema.set('timestamps', true);
UserPermissionSchema.index({ createdAt: 1, updatedAt: 1 });
UserPermissionSchema.index({ userId: 1 });
