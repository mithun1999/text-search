import { Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async create(payload: CreatePostDto) {
    return this.postRepository.create(payload);
  }

  async update(id: string, payload: UpdatePostDto) {
    return this.postRepository.findOneAndUpdate({ _id: id }, payload);
  }

  findAll() {
    return this.postRepository.find({});
  }

  findOne(id: string) {
    return this.postRepository.findOne({ _id: id });
  }

  remove(id: string) {
    return this.postRepository.findOneAndRemove({ _id: id });
  }
}
