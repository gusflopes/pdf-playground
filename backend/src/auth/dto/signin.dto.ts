// or signin.input.ts
import { IsEmail, IsString, MinLength } from 'class-validator';

export class SigninDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
