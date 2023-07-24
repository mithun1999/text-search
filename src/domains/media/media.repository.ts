import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BulkWriteResult } from 'mongodb';
import { FilterQuery, Model } from 'mongoose';
import { CreateMediaDto, UpdateMediaDto } from './dto/media.dto';
import { Media, MediaDocument } from './schema/media.schema';

@Injectable()
export class MediaRepository {
  constructor(
    @InjectModel(Media.name) private mediaModel: Model<MediaDocument>,
  ) {}

  async create(createMediaDto: CreateMediaDto): Promise<MediaDocument> {
    const newMedia = new this.mediaModel(createMediaDto);
    return newMedia.save();
  }

  async bulkCreate(createMediaDto: CreateMediaDto[]): Promise<MediaDocument[]> {
    return this.mediaModel.insertMany(createMediaDto);
  }

  async find(mediaFilterQuery: FilterQuery<MediaDocument>): Promise<Media[]> {
    return this.mediaModel.find(mediaFilterQuery);
  }

  async findOne(mediaFilterQuery: FilterQuery<MediaDocument>) {
    return this.mediaModel.findOne(mediaFilterQuery);
  }

  async findOneAndUpdate(
    mediaFilterQuery: FilterQuery<MediaDocument>,
    user: UpdateMediaDto,
  ): Promise<Media> {
    return this.mediaModel.findOneAndUpdate(mediaFilterQuery, user, {
      new: true,
    });
  }

  async findOneAndRemove(
    mediaFilterQuery: FilterQuery<MediaDocument>,
  ): Promise<Media> {
    return this.mediaModel.findOneAndRemove(mediaFilterQuery);
  }

  async bulkWrite(mediaBulkQuery: any[]): Promise<BulkWriteResult> {
    return this.mediaModel.bulkWrite(mediaBulkQuery);
  }
}
