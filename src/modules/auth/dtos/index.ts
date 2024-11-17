import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDefined, IsEnum, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { UserTypes } from 'src/common/enums';
import { IsStringObjectId, ObjectIdTransform } from 'src/common/validators';

export class SignInRequestDTO {
  @ApiProperty()
  @IsDefined()
  @IsString()
  username: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  password: string;
}

export class SignInParamsDTO {
  @ApiProperty({ type: 'string', required: true })
  @IsDefined()
  @IsEnum(UserTypes)
  type: UserTypes;
}

export class RefreshTokenDTO {
  // @ApiProperty({ type: 'string' })
  // @Transform((value) => ObjectIdTransform(value))
  // @IsDefined()
  // @IsStringObjectId()
  // userId: Types.ObjectId;

  @ApiProperty()
  @IsDefined()
  @IsString()
  refreshToken: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  deviceId: string;

  @ApiProperty({ type: 'string', required: true })
  @IsDefined()
  @IsEnum(UserTypes)
  userType: UserTypes;
}

export class LogoutDTO {
  @ApiProperty()
  @IsDefined()
  @IsString()
  deviceId: string;

  @ApiProperty({ type: 'string', required: true })
  @IsDefined()
  @IsEnum(UserTypes)
  userType: UserTypes;
}
