import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { VendorService } from '../services/vendor.services';
import { SignupRequestDto } from '../dtos/vendor-dto';
import { CommonResponse } from 'src/common/interfaces';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Authorize, Public } from 'src/modules/acl/decorators/acl.decorator';
import { ParamsIdRequest } from 'src/common/dtos';

@Controller('vendor')
@ApiTags('Vendor')
@ApiBearerAuth('JWT-auth')
export class VendorController {
  constructor(private vendorService: VendorService) {
    console.log('Vendor controller');
  }
  @Public()
  @Post('/signup')
  async signup(@Body() body: SignupRequestDto): Promise<CommonResponse<any>> {
    const data = await this.vendorService.signUp(body);
    return { data, status: HttpStatus.OK };
  }

  @Authorize()
  @Get('/:id')
  async getUser(@Param() params: ParamsIdRequest) {
    const data = await this.vendorService.getVendorById(params.id);
    return { data, status: HttpStatus.OK };
  }
}
