import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';

import { FileUploadService } from './modules/file-upload/file-upload.service';

@Module({
  
  imports: [AuthModule,ConfigModule.forRoot(
    {
      envFilePath: '../.env',
    }
  ),],
  controllers: [AppController],
  providers: [AppService, FileUploadService],
})
export class AppModule {}
