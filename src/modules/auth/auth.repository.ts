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

  async findAllUsers(): Promise<ReturnAllUsersDto[]> {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        lastLogin: true,
        img:true,
        password: false,
        token: false,
      }, 
    });
    return users;
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    return this.prisma.user.update(params);
  }

  async deleteUser(params: { where: Prisma.UserWhereUniqueInput }): Promise<User> {
    return this.prisma.user.delete(params);
  }
}
