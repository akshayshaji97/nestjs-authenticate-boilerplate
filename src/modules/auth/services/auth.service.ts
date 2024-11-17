import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  LogoutDTO,
  RefreshTokenDTO,
  SignInParamsDTO,
  SignInRequestDTO,
} from '../dtos';
import { UserTypes } from 'src/common/enums';
import { Dict } from 'src/common/interfaces';
import { VendorService } from 'src/modules/vendor/services/vendor.services';
import * as bcrypt from 'bcrypt';
import { AclService } from 'src/modules/acl/services/acl.service';
import { randomBytes } from 'crypto';
import { Types } from 'mongoose';
import config from 'src/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger();
  constructor(
    @Inject() private readonly jwtService: JwtService,
    @Inject(forwardRef(() => VendorService))
    private vendorService: VendorService,
    @Inject(forwardRef(() => AclService))
    private aclService: AclService,
  ) {}
  async signIn(
    credentials: SignInRequestDTO,
    params: SignInParamsDTO,
    req: any,
  ) {
    const user = await this.validateUser(credentials, params.type);
    if (!user) {
      throw new UnauthorizedException();
    }
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip;

    const userDataInToken = {
      role: user.role,
      name: user.name,
      maiVeri: user.emailVerified,
      phVeri: user.phoneVerified,
    };
    const deviceId = this.generateDeviceId();
    const tokenData = await this.aclService.authenticate(
      user._id,
      userDataInToken,
    );

    // Store refresh token
    await this.aclService.storeRefreshToken(
      user._id,
      params.type,
      tokenData.refreshToken,
      deviceId,
    );
    // Store user session info
    await this.aclService.storeUserSessionsToken(
      user._id,
      params.type,
      deviceId,
      userAgent,
      ipAddress,
    );

    return {
      ...tokenData,
      user,
      deviceId,
    };
  }

  private generateDeviceId(): string {
    return randomBytes(16).toString('hex');
  }

  async validateUser(
    credentials: SignInRequestDTO,
    userType: UserTypes,
  ): Promise<any> {
    const filters: Dict = { isActive: true };
    let userRecord = undefined;
    if (userType === UserTypes.Vendor) {
      filters.$or = [
        {
          phone: credentials.username,
        },
        {
          email: credentials.username,
        },
      ];
      userRecord = await this.vendorService.getVendor(filters);
    }
    if (!userRecord) {
      throw new NotFoundException('Username or password incorrect');
    }

    const isPasswordCorrect = await bcrypt.compare(
      credentials.password,
      userRecord.hashedPassword || '',
    );
    if (!isPasswordCorrect) {
      throw new NotFoundException('Username or password incorrect');
    }

    return {
      _id: userRecord._id,
      role: userRecord.role,
      name: userRecord.name,
      email: userRecord.email,
      phone: userRecord.phone,
      emailVerified: userRecord.emailVerified,
      phoneVerified: userRecord.phoneVerified,
    };
  }

  async refreshTokens(data: RefreshTokenDTO) {
    const { refreshToken, deviceId, userType } = data;
    if (!refreshToken || !deviceId) {
      throw new BadRequestException('Refresh token and device ID are required');
    }
    try {
      const payload = this.jwtService.decode(refreshToken);
      const { usrId: userId } = payload;
      if (!userId) {
        throw new UnauthorizedException();
      }
      const user = await await this.vendorService.getVendorById(
        new Types.ObjectId(userId.toString()),
      );
      if (!user) {
        throw new UnauthorizedException();
      }

      const userDataInToken = {
        role: user.role,
        name: user.name,
        maiVeri: user.emailVerified,
        phVeri: user.phoneVerified,
      };
      return await this.aclService.refreshTokens(
        refreshToken,
        deviceId,
        userType,
        userId,
        userDataInToken,
      );
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(token: string, data: LogoutDTO) {
    const { deviceId, userType } = data;
    return await this.aclService.logOut(token, deviceId, userType);
  }
}
