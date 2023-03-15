
import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import {config,S3} from 'aws-sdk';


@Injectable()
export class FileUploadService {
  constructor(
    
    private readonly configService: ConfigService,
  ) {}

  async uploadFile(params: {
    folder: string;
    email: string;
    image: Express.Multer.File;
  }): Promise<string> {
    const { email,image,folder } = params;
    config.update({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region:"ap-south-1"
    });
    
    // Create an instance of AWS S3
    const s3 = new S3();
    
    // Read image data
    // const imageData = readFileSync(image.);
    
    // Set S3 upload parameters
    const uploadParams = {
      Bucket:'cce-web-test',
      Key: `${folder}/${email}.${image.originalname.split('.').pop()}`,
      Body: image.buffer,

    };
    
    // Upload image to S3 bucket
    const result = await s3.upload(uploadParams).promise();

    return result.Location;

  }
}
