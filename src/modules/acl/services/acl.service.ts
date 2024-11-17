import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserPermission } from '../schemas';
import { addDays } from 'date-fns';
import { JwtService } from '@nestjs/jwt';
import config from 'src/config';
import { TokenType, UserTypes } from 'src/common/enums';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { hashToken } from 'src/common/utils';

@Injectable()
export class AclService {
  private readonly logger = new Logger();
  constructor(
    @Inject() private readonly jwtService: JwtService,
    @InjectModel(UserPermission.name)
    private userPermissionModel: Model<UserPermission>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async authenticate(userId: Types.ObjectId, data: any) {
    const userPermissions = await this.userPermissionModel
      .findOne(
        {
          userId,
        },
        'apiPermissions role',
      )
      .lean();

    const accessToken = await this.createAuthToken(
      {
        ...data,
        apiPer: userPermissions?.apiPermissions || {},
        usrId: userId,
      },
      config.jwt.accessExpiry,
      TokenType.Access,
      config.jwt.accessSecret,
    );
    const refreshToken = await this.createAuthToken(
      {
        ...data,
        apiPer: userPermissions?.apiPermissions || {},
        usrId: userId,
      },
      config.jwt.refreshExpiry,
      TokenType.Refresh,
      config.jwt.refreshSecret,
    );
    const accessTokenExpiry = addDays(new Date(), config.jwt.accessExpiry);
    const refreshTokenExpiry = addDays(new Date(), config.jwt.refreshExpiry);

    const tokenData = {
      accessToken,
      refreshToken,
      userId,
      accessTokenExpiry,
      refreshTokenExpiry,
      apiPermissions: userPermissions?.apiPermissions || {},
    };

    return tokenData;
  }

  private async createAuthToken(
    data: any,
    expiresIn: number,
    type: TokenType,
    secret: string = config.jwt.secret,
  ) {
    return this.jwtService.sign(
      { ...data, type },
      {
        secret,
        expiresIn,
      },
    );
  }

  async storeRefreshToken(
    userId: Types.ObjectId,
    userType: UserTypes,
    refreshToken: string,
    deviceId: string,
  ) {
    const hashedToken = hashToken(refreshToken);
    const key = `refresh_tokens:${userId?.toString()}:${deviceId}:${userType}`;

    await this.cacheManager.set(key, hashedToken, config.jwt.refreshExpiry);
  }

  async storeUserSessionsToken(
    userId: string,
    userType: UserTypes,
    deviceId: string,
    userAgent: string,
    ipAddress: string,
  ) {
    await this.cacheManager.set(
      `user_session:${userId?.toString()}:${deviceId}:${userType}`,
      {
        deviceId,
        lastActive: new Date(),
        userAgent,
        ipAddress,
      },
      config.jwt.refreshExpiry,
    );
  }

  async logOut(token: string, deviceId: string, userType: UserTypes) {
    const payload = this.jwtService.decode(token);
    const { usrId: userId } = payload;
    const timeUntilExpiryMs =
      (payload.exp - Math.floor(Date.now() / 1000)) * 1000;
    if (timeUntilExpiryMs > 0) {
      const hashedKey = hashToken(token);
      await this.cacheManager.set(
        `blacklist:${hashedKey}`,
        'true',
        timeUntilExpiryMs,
      );
    }

    // Remove refresh token
    await this.cacheManager.del(
      `refresh_tokens:${userId?.toString()}:${deviceId}:${userType}`,
    );
    // Remove session info
    await this.cacheManager.del(
      `user_session:${userId?.toString()}:${deviceId}:${userType}`,
    );
  }

  async refreshTokens(
    refreshToken: string,
    deviceId: string,
    userType: UserTypes,
    userId: Types.ObjectId,
    data: any,
  ) {
    try {
      // Verify refresh token
      const payload = await this.jwtService.verify(refreshToken, {
        secret: config.jwt.refreshSecret,
      });

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      // Check if refresh token is valid in Redis
      const storedToken = await this.cacheManager.get(
        `refresh_tokens:${userId?.toString()}:${deviceId}:${userType}`,
      );
      const hashedToken = hashToken(refreshToken);
      if (!storedToken || storedToken !== hashedToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new token pair
      const tokenData = await this.authenticate(userId, data);

      // Update refresh token in Redis
      await this.storeRefreshToken(
        userId,
        userType,
        tokenData.refreshToken,
        deviceId,
      );

      return tokenData;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logoutAllDevices(userId: string) {
    const pattern = `refresh_tokens:${userId}:*`;
    const sessionPattern = `user_session:${userId}:*`;

    // Get all refresh tokens for user
    const keys = await this.cacheManager.store.keys(pattern);
    const sessionKeys = await this.cacheManager.store.keys(sessionPattern);

    // Delete all refresh tokens and sessions
    await Promise.all([
      ...keys.map((key) => this.cacheManager.del(key)),
      ...sessionKeys.map((key) => this.cacheManager.del(key)),
    ]);
  }

  async getUserActiveSessions(userId: string) {
    const pattern = `user_session:${userId}:*`;
    const keys = await this.cacheManager.store.keys(pattern);
    const sessions = await Promise.all(
      keys.map((key) => this.cacheManager.get(key)),
    );
    return sessions;
  }
}
