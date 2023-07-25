import { Inject, Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { getSlugFromName } from 'src/util/string.util';
import { CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class PostService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly postRepository: PostRepository,
  ) {}

  async create(payload: CreatePostDto) {
    const slug = getSlugFromName(payload.title);
    return this.postRepository.create({ ...payload, slug });
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

  async findByPage(page: number, limit: number) {
    return this.postRepository.findByPage({ page, limit });
  }

  async search(key: string) {
    const cachedVal = await this.cacheManager.get(`search-${key}`);
    if (!cachedVal) {
      const results = await this.postRepository.find({
        $text: { $search: key },
      });
      await this.cacheManager.set(`search-${key}`, JSON.stringify(results));
      return results;
    }
    return JSON.parse(cachedVal);
  }

  remove(id: string) {
    return this.postRepository.findOneAndRemove({ _id: id });
  }
}
