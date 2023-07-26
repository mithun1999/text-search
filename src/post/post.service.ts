import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { getSlugFromName } from 'src/util/string.util';
import { CreatePostDto } from './dto/create-post.dto';
import { PostRepository } from './post.repository';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('1234567890', 5);

@Injectable()
export class PostService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly postRepository: PostRepository,
  ) {}

  async create(payload: CreatePostDto) {
    const slug = await this.handleSlugExists(payload.title);
    return this.postRepository.create({ ...payload, slug });
  }

  async handleSlugExists(title: string) {
    const slug = getSlugFromName(title);

    // Need to implement cache for this because it's recurring
    const isSlugExists = this.findBySlug(slug);
    if (isSlugExists) return `${slug}-${nanoid()}`;
    return slug;
  }

  findAll() {
    return this.postRepository.find({});
  }

  findOne(id: string) {
    return this.postRepository.findOne({ _id: id });
  }

  findBySlug(slug: string) {
    return this.postRepository.findOne({ slug });
  }

  async findByPage(page: number, limit: number) {
    return this.postRepository.findByPage({ page, limit });
  }

  async search(key?: string, page?: number, limit?: number) {
    if (key) {
      const cachedVal = await this.cacheManager.get(`search-${key}`);
      if (!cachedVal) {
        const results = await this.postRepository.findByPage(
          { page, limit },
          { $text: { $search: key } },
        );
        await this.cacheManager.set(`search-${key}`, JSON.stringify(results));
        return results;
      }
      return JSON.parse(cachedVal);
    } else if (page && limit) {
      return this.findByPage(page, limit);
    } else {
      return this.postRepository.findByPage({}, {});
    }
  }
}
