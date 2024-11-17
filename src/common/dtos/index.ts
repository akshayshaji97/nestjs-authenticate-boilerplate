import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ObjectIdTransform } from '../validators/transform';
import { IsDefined } from 'class-validator';
import { IsStringObjectId } from '../validators';
import { Types } from 'mongoose';

export class ParamsIdRequest {
  @ApiProperty({ type: 'string' })
  @Transform(ObjectIdTransform)
  @IsDefined({ message: 'Invalid ObjectId - id' })
  @IsStringObjectId()
  id: Types.ObjectId;
}
