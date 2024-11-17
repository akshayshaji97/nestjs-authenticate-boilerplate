import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserToken,
  UserTokenSchema,
  UserPermission,
  UserPermissionSchema,
} from './schemas';
import { AclService } from './services/acl.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserToken.name,
        schema: UserTokenSchema,
      },
      {
        name: UserPermission.name,
        schema: UserPermissionSchema,
      },
    ]),
  ],
  providers: [AclService],
  exports: [AclService],
})
export class AclModule {}
