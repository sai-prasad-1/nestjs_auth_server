import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UserLoginDto {
  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}