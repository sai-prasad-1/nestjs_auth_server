import { Module } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { FileUploadService } from '../file-upload/file-upload.service';

@Module({
    providers: [ConfigService,FileUploadService],
    exports: [FileUploadService],
})
export class FileUploadModule {}
