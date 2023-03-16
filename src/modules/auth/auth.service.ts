import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { User } from '@prisma/client';
import { FileUploadService } from '../file-upload/file-upload.service';
import * as bcrypt from 'bcrypt';
import { InvalidPasswordException } from 'src/Exceptions/invalid-password.exception';
import { sign } from 'jsonwebtoken';


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
      throw new InvalidPasswordException();
    }
    const payload = { email, role: user?.role };
    const accessToken = sign(payload, 'your-secret-key');
    user.token = accessToken;
    return user;
  }
}
