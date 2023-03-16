import { Role } from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Validate,
  isString,
} from 'class-validator';

export class UserRegisterDto {
  constructor(name: string, email: string, password: string, role: Role) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  password: string;

  @IsNotEmpty()
  @Validate(validateRole)
  role: Role;
}

function validateRole(role: string): role is Role {
  return (
    role === Role.ADMIN ||
    role === Role.SUPER_ADMIN ||
    role === Role.FINAL_STATION_USER ||
    role === Role.PRODUCTION_USER ||
    role === Role.QC_USER
  );
}
