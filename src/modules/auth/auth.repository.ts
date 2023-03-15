import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
@Injectable()
export class AuthRepository {
  constructor(private prisma: PrismaService) {}

  async createUser(params: { data: Prisma.UserCreateInput }): Promise<User> {
    const { data } = params;
    return this.prisma.user.create({ data });
  }

  async findUserByEmail(params: { email: string }): Promise<User | null> {
    const { email } = params;
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user;
  }

  async loginUser(params: {
    email: string;
    password: string;
  }): Promise<User | null> {
    const { email, password } = params;
    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });
    return user;
  }
}
