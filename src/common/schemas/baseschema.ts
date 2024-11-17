import { Schema } from '@nestjs/mongoose';
import { Exclude, Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { ObjectIdTransform } from '../validators/transform';

@Schema()
export class BaseSchema {
  @IsOptional()
  @Transform(ObjectIdTransform)
  _id?: Types.ObjectId;

  @Exclude({ toClassOnly: true })
  createdAt?: Date;

  @Exclude({ toClassOnly: true })
  updatedAt?: Date;
}
