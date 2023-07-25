import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BulkWriteResult } from 'mongodb';
import { FilterQuery, PaginateModel, PaginateOptions } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, PostDocument } from './schema/post.schema';

@Injectable()
export class PostRepository {
  constructor(
    @InjectModel(Post.name) private postModel: PaginateModel<PostDocument>,
  ) {}

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

  async findByPage(query: PaginateOptions) {
    const options = {
      ...query,
    };
    return this.postModel.paginate({}, options);
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
