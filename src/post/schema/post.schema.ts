import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  body: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop()
  author: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.index({ body: 'text', title: 'text' });

PostSchema.plugin(uniqueValidator, { type: 'MongooseError' });
PostSchema.plugin(mongoosePaginate);

