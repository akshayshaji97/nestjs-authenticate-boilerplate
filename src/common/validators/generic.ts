import * as mongoose from 'mongoose';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsStringObjectIdConstraint', async: false })
export class IsStringObjectIdConstraint
  implements ValidatorConstraintInterface
{
  validate(text: string, args: ValidationArguments): boolean {
    return !!text && mongoose.Types.ObjectId.isValid(text);
  }

  defaultMessage(args: ValidationArguments) {
    return '$value is not a valid ObjectId';
  }
}

export const IsStringObjectId = (validationOptions?: ValidationOptions) => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'IsStringObjectId',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsStringObjectIdConstraint,
    });
  };
};
