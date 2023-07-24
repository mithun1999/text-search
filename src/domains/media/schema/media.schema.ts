import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/domains/account/user/user/schema/user.schema';

export type MediaDocument = Media & Document;

@Schema()
export class Media {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  url: string;

  @Prop()
  type: string;

  @Prop()
  size: number;

  @Prop()
  mime: string;

  @Prop()
  ext: string;

  @Prop()
  altText: string;

  @Prop()
  public: boolean;

  @Prop()
  provider: string;

  @Prop()
  identifier: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  owner: User;
}

export const MediaSchema = SchemaFactory.createForClass(Media);
