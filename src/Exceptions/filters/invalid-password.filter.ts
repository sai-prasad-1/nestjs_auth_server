import { Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { InvalidPasswordException } from '../invalid-password.exception';

@Catch(InvalidPasswordException)
export class InvalidPasswordFilter implements ExceptionFilter {
  catch(exception: InvalidPasswordException, response: any) {
    response.status(HttpStatus.UNAUTHORIZED).json({
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'Invalid password',
    });
  }
}