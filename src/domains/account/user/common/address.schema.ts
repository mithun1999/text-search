import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';

export type AddressDocument = Address & Document;

@Schema({ timestamps: true })
export class Address extends Document {
  @Prop({ required: true })
  address1: string;

  @Prop()
  address2: string;

  @Prop({ required: true })
  city: string;

  @Prop()
  company: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  zip: string;

  @Prop()
  fingerprint: string;

  @Prop({ required: true })
  firstName: string;

  @Prop()
  lastName: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);

AddressSchema.plugin(uniqueValidator, { type: 'MongooseError' });
