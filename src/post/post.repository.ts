import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, PaginateModel, PaginateOptions } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
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

  async find(postFilterQuery: FilterQuery<PostDocument>): Promise<Post[]> {
    return this.postModel.find(postFilterQuery);
  }

  async findOne(postFilterQuery: FilterQuery<PostDocument>) {
    return this.postModel.findOne(postFilterQuery).lean();
  }

  async findByPage(options: PaginateOptions, query?: FilterQuery<Post>) {
    return this.postModel.paginate(query, options);
  }
}
