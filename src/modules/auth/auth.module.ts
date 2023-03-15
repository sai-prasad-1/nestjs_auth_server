import { Module } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';
import { FileUploadService } from '../file-upload/file-upload.service';
import { APP_FILTER } from '@nestjs/core';
import { InvalidPasswordFilter } from 'src/Exceptions/filters/invalid-password.filter';

@Module({
    imports: [PrismaModule],
    providers: [AuthRepository,AuthService,ConfigService,FileUploadService,{provide:APP_FILTER,useClass:InvalidPasswordFilter}],
    exports: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
