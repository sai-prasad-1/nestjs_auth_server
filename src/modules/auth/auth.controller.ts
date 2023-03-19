import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  SetMetadata,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Role, User } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserRegisterDto } from 'interfaces/Dto/UserRegisterDto';
import { UserLoginDto } from 'interfaces/Dto/UserLoginDto';
import { JwtAuthGuard } from 'src/guards/jwtguard/jwtguard.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  @UseGuards(JwtAuthGuard)
  @SetMetadata('roles', [Role.ADMIN, Role.SUPER_ADMIN])
  @UseInterceptors(FileInterceptor('image'))
  async register(
    @Body() userRegisterDto: UserRegisterDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<User> {
    const { name,email, password, role } = userRegisterDto;
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
  @Get('users')
  @UseGuards(JwtAuthGuard)
  @SetMetadata('roles', [Role.ADMIN, Role.SUPER_ADMIN])
  async getAllUsers(): Promise<ReturnAllUsersDto[]> {
    return this.authService.getAllUsers();
  }
  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  @SetMetadata('roles', [Role.SUPER_ADMIN])
  async deleteUser(@Param('id') id: string): Promise<User> {
    return this.authService.deleteUser(id);
  }
}
