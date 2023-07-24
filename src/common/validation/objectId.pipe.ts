import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseObjectId implements PipeTransform {
  transform(value: any) {
    if (isValidObjectId(value)) return value;
    else throw new BadRequestException('Id is invalid', 'Bad Request');
  }
}
