import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { validate } from 'class-validator';
import { UserRegisterDto } from 'interfaces/Dto/UserRegisterDto';
import { UserLoginDto } from 'interfaces/Dto/UserLoginDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('image'))
  async register(
    @Body() userRegisterDto: UserRegisterDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<User> {
    const { name,email, password, role } = userRegisterDto;
    const userRegisterData = new UserRegisterDto(name,email, password, role);
    const errors = await validate(userRegisterData);
    if (errors.length > 0) {
      throw new HttpException(errors, 400);
    }

    const user = await this.authService.createUser({
      name,
      email,
      password,
      role,
      image,

    });
    return user;
  }

  @Post('login')
  async loginUser(@Body() userLoginDto:UserLoginDto): Promise<User | null> {
    const {email, password } = userLoginDto;
    console.log(userLoginDto);
    // const userloginDto = new UserLoginDto(email, password);
    // const errors = await validate(userloginDto);
    // if (errors.length > 0) {
    //   throw new HttpException(errors, 400);
    // }
  const user = await this.authService.loginUser({ email, password });
  return user;
  }
}
