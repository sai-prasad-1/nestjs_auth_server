import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { appendFile } from 'fs';

@Injectable()
export class AppService {
 
  getHello(): string {
    console.log();
    return 'Hello World!';
  }
}
