import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { Authorize, Public } from 'src/modules/acl/decorators/acl.decorator';
import { CommonResponse } from 'src/common/interfaces';
import {
  LogoutDTO,
  RefreshTokenDTO,
  SignInParamsDTO,
  SignInRequestDTO,
} from '../dtos';
import { AclService } from 'src/modules/acl/services/acl.service';

@Controller('auth')
@ApiTags('Authentication')
@ApiBearerAuth('JWT-auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private aclservice: AclService,
  ) {
    console.log('Auth controller');
  }

  @Public()
  @Post('/signin/:type')
  async signIn(
    @Body() credentials: SignInRequestDTO,
    @Param() params: SignInParamsDTO,
    @Request() req: any,
  ): Promise<CommonResponse<any>> {
    const tokenData = await this.authService.signIn(credentials, params, req);
    return { data: tokenData, status: HttpStatus.OK };
  }

  @Post('/refresh')
  async refresh(@Body() data: RefreshTokenDTO) {
    return this.authService.refreshTokens(data);
  }

  @Authorize()
  @Post('/logout')
  async logout(@Request() req: any, @Body() data: LogoutDTO) {
    const token = req.headers.authorization.split(' ')[1];
    await this.authService.logout(token, data);
    return { message: 'Successfully logged out' };
  }

  @Authorize()
  @Post('/logout-all')
  async logoutAll(@Request() req: any) {
    await this.aclservice.logoutAllDevices(req.user.usrId);
    return { message: 'Successfully logged out from all devices' };
  }

  @Authorize()
  @Get('/sessions')
  async getSessions(@Request() req: any) {
    return this.aclservice.getUserActiveSessions(req.user.id);
  }
}
