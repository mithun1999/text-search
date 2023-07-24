import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';

export type PhoneNumberDocument = PhoneNumber & Document;

@Schema({ timestamps: true })
export class PhoneNumber extends Document {
  @Prop({ required: true })
  countryCode: string;

  @Prop({ required: true })
  phone: string;
}

export const PhoneNumberSchema = SchemaFactory.createForClass(PhoneNumber);

PhoneNumberSchema.plugin(uniqueValidator, { type: 'MongooseError' });
