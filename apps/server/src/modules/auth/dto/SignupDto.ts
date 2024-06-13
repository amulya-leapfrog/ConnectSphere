import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class SignupDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  residence: string;

  @IsNotEmpty()
  @Matches(/^[0-9]+$/, {
    message: 'Phone number must contain only numbers',
  })
  phone: string;

  bio: string;
}
