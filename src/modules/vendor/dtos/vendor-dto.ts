import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDefined,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { PhoneNumberTransform } from 'src/common/validators/transform';

export class SignupRequestDto {
  @ApiProperty()
  @IsDefined()
  @Transform(({ value }) => PhoneNumberTransform(value))
  @IsPhoneNumber(undefined, { message: 'Please enter a valid phone number' })
  phone: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  password: string;
}
