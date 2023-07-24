import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Error as MongooseError } from 'mongoose';
import { Response } from 'express';
import ValidationError = MongooseError.ValidationError;
import { ValidationException } from '../interface/ValidationException.interface';

@Catch(ValidationError)
export class MongoValidationExceptionFilter implements ExceptionFilter {
  formatMongoError(exception: ValidationException) {
    // console.log('**EXCEPTION**', JSON.stringify(exception));
    const errors = Object.values(exception.errors);
    const lErrors = errors.map((err) => {
      return err.message;
    });

    const customError = {
      statusCode: HttpStatus.BAD_REQUEST,
      message: lErrors[0],
      errors: lErrors,
    };
    return customError;
  }
  catch(exception: ValidationException, host: ArgumentsHost) {
    console.log('**EXCEPTION**', JSON.stringify(exception));
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const mongoError = this.formatMongoError(exception);
    response.statusCode = mongoError.statusCode;
    response.json(mongoError);
  }
}
