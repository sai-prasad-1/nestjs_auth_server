import { Module } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';
import { FileUploadService } from '../file-upload/file-upload.service';
import { APP_FILTER } from '@nestjs/core';
import { InvalidPasswordFilter } from 'src/Exceptions/filters/invalid-password.filter';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/accessToken.strategy';

@Module({
    imports: [PrismaModule,PassportModule,JwtModule.register({
      // TODO: move secret to env
        secret: 'your-secret-key',
        signOptions: { expiresIn: '1d' },
      }),],
    providers: [AuthRepository,AuthService,ConfigService,FileUploadService,{provide:APP_FILTER,useClass:InvalidPasswordFilter},JwtStrategy],
    exports: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
