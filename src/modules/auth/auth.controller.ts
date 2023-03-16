import {
  Body,
  Controller,
  HttpException,
  Post,
  SetMetadata,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Role, User } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { validate } from 'class-validator';
import { UserRegisterDto } from 'interfaces/Dto/UserRegisterDto';
import { UserLoginDto } from 'interfaces/Dto/UserLoginDto';
import { JwtAuthGuard } from 'src/guards/jwtguard/jwtguard.guard';
import { RolesGuard } from 'src/guards/roles-guard/roles-guard.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('register')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @SetMetadata('roles', [Role.ADMIN, Role.SUPER_ADMIN])
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
  const user = await this.authService.loginUser({ email, password });
  return user;
  }
}
