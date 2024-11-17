import { IsDefined, IsEmail } from 'class-validator';

export class createUserDto {
  @IsDefined()
  name: string;

  @IsDefined()
  @IsEmail()
  email: string;

  @IsDefined()
  password: string;

  @IsDefined()
  confirmPassword: string;
}
