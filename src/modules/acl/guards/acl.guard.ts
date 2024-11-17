import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { AclConfig } from '../interfaces/acl-config';
import { ExtractJwt } from 'passport-jwt';
import config from 'src/config';
import { UserPermission } from '../schemas';
import authorize from '../helpers/authorize';
import { IS_PUBLIC_KEY } from '../decorators/acl.decorator';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { hashToken } from 'src/common/utils';
import { Types } from 'mongoose';

@Injectable()
export class AclGuard implements CanActivate {
  @Inject() jwtService: JwtService;
  constructor(
    private reflector: Reflector,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    let aclConfig = this.reflector.get<AclConfig | undefined>(
      'acl',
      context.getHandler(),
    );
    if (!aclConfig) {
      aclConfig = this.reflector.get<AclConfig | undefined>(
        'acl',
        context.getClass(),
      );
    }
    if (!aclConfig) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    const payload = this.jwtService.decode(token); console.log('---payload----', payload);

    let user: any;
    try {
      user = await this.verifyToken(token);
    } catch (e) {
      throw new UnauthorizedException();
    }

    if (!user || typeof user === 'string') {
      throw new UnauthorizedException();
    }

    const userPermissionData: UserPermission = {
      userId: user._id,
      apiPermissions: user.apiPermissions,
      role: user.role,
    };

    const authData = authorize(
      { ...userPermissionData },
      aclConfig || { authenticationManager: 'authenticate' },
    );

    const { isAuthorized, permission, role } = { ...authData };

    if (!isAuthorized) {
      return false;
    }

    request.user = { ...user, _id: new Types.ObjectId(user._id) };
    request.permission = permission;
    request.role = role;
    request.acl = aclConfig;

    return true;
  }

  private verifyToken = async (token: string) => {
    // Check if token is blacklisted
    const hashedKey = hashToken(token);
    const isBlacklisted = await this.cacheManager.get(`blacklist:${hashedKey}`);
    if (isBlacklisted) {
      return false;
    }
    return this.jwtService.verify(token, { secret: config.jwt.accessSecret });
  };
}
