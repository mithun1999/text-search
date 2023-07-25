import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BulkWriteResult } from 'mongodb';
import { FilterQuery, Model } from 'mongoose';
import { Post, PostDocument } from './schema/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async create(createPostDto: CreatePostDto): Promise<PostDocument> {
    const newPost = new this.postModel(createPostDto);
    return newPost.save();
  }

  async bulkCreate(createPostDto: CreatePostDto[]): Promise<PostDocument[]> {
    return this.postModel.insertMany(createPostDto);
  }

  async find(postFilterQuery: FilterQuery<PostDocument>): Promise<Post[]> {
    return this.postModel.find(postFilterQuery);
  }

  async findOne(postFilterQuery: FilterQuery<PostDocument>) {
    return this.postModel.findOne(postFilterQuery);
  }

  async findOneAndUpdate(
    postFilterQuery: FilterQuery<PostDocument>,
    user: UpdatePostDto,
  ): Promise<Post> {
    return this.postModel.findOneAndUpdate(postFilterQuery, user, {
      new: true,
    });
  }

  async findOneAndRemove(
    postFilterQuery: FilterQuery<PostDocument>,
  ): Promise<Post> {
    return this.postModel.findOneAndRemove(postFilterQuery);
  }

  async bulkWrite(postBulkQuery: any[]): Promise<BulkWriteResult> {
    return this.postModel.bulkWrite(postBulkQuery);
  }
}
