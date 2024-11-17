import { TransformFnParams } from 'class-transformer';
import mongoose from 'mongoose';

export const ObjectIdTransform = (
  params: TransformFnParams,
): mongoose.Types.ObjectId | undefined => {
  const { value } = params;

  if (!value) return undefined;
  if (mongoose.Types.ObjectId.isValid(value)) {
    return new mongoose.Types.ObjectId(value);
  }

  return undefined;
};

export const PhoneNumberTransform = (value?: string) => {
  value && !value.startsWith('+') ? `+${value}` : value;
};
