import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import config from './config';
import { AdminModule } from './modules/admin/admin.module';
import { AclModule } from './modules/acl/acl.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AclGuard } from './modules/acl/guards/acl.guard';
import { AuthModule } from './modules/auth/auth.module';
import { UserToken, UserTokenSchema } from './modules/acl/schemas';
import { VendorModule } from './modules/vendor/vendor.module';
import { CustomerModule } from './modules/customer/customer.module';
import { CacheModule, CacheModuleOptions } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      useFactory: () => ({
        secret: config.jwt.secret,
        signOptions: { expiresIn: '1d' },
      }),
    }),
    MongooseModule.forFeature([
      {
        name: UserToken.name,
        schema: UserTokenSchema,
      },
    ]),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: (): CacheModuleOptions => ({
        store: redisStore,
        host: 'localhost',
        port: 6379,
        ttl: 604800, // 7 days in seconds (for refresh tokens)
        max: 1000,
      }),
    }),
    ConfigModule.forRoot({ envFilePath: '.env.development' }),
    MongooseModule.forRoot(config.mongoUrl),
    AdminModule,
    AclModule,
    AuthModule,
    VendorModule,
    CustomerModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AclGuard,
    },
  ],
})
export class AppModule {}
