import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { VendorModule } from '../vendor/vendor.module';
import { AclModule } from '../acl/acl.module';

@Module({
  imports: [forwardRef(() => VendorModule), forwardRef(() => AclModule)],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
