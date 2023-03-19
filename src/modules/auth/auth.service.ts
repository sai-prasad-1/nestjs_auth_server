import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { User } from '@prisma/client';
import { FileUploadService } from '../file-upload/file-upload.service';
import * as bcrypt from 'bcrypt';
import { InvalidPasswordException } from 'src/Exceptions/invalid-password.exception';
import { sign } from 'jsonwebtoken';
import { UserRegisterDto } from 'interfaces/Dto/UserRegisterDto';
import { validate } from 'class-validator';


@Injectable()
export class AuthService {
  constructor(
    private repository: AuthRepository,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async createUser(params: {
    name: User['name'];
    email: User['email'];
    password: User['password'];
    role: Role;
    image: Express.Multer.File;
  }): Promise<User> {
    const { name, email, password, role, image } = params;
    const userRegisterData = new UserRegisterDto(name!,email, password, role);
    const errors = await validate(userRegisterData);
    if (errors.length > 0) {
      throw new HttpException(errors, 400);
    }
    const oldUser = await this.repository.findUserByEmail({ email });
    if (oldUser) {
      throw new ConflictException('User already exists');
    }

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    const imageUrl = await this.fileUploadService.uploadFile({
      folder: 'profile',
      email,
      image,
    });
    const user = this.repository.createUser({
      data: { name, email, password: hashedPassword, role, img: imageUrl },
    });
    return user;
  }

  async loginUser(params: {
    email: User['email'];
    password: User['password'];
  }): Promise<User | null> {
    const { email, password } = params;
    const user = await this.repository.findUserByEmail({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new NotFoundException("Invalid password");
    }
    user.lastLogin = new Date();
    await this.repository.updateUser({
      where: { id: user.id },
      data: { lastLogin: user.lastLogin },
    });
    const payload = { email, role: user?.role };
    const accessToken = sign(payload, 'your-secret-key');
    user.token = accessToken;
    user.password = '';
    return user;
  }

  async getAllUsers(): Promise<ReturnAllUsersDto[]> {
    return this.repository.findAllUsers();
  }

  async deleteUser(id: string): Promise<User> {
    const newId = parseInt(id);
    return this.repository.deleteUser(
      { where: { id: newId } },
    );
  }
}
