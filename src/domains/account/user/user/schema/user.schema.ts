import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';
import { Media } from 'src/domains/media/schema/media.schema';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  phone: string;

  @Prop()
  provider: string;

  @Prop()
  providerId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Media' })
  image: Media;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.plugin(uniqueValidator, { type: 'MongooseError' });
