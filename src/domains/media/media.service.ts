import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../account/user/user/schema/user.schema';
import { CreateMediaDto, UpdateMediaDto } from './dto/media.dto';
import { MediaRepository } from './media.repository';
import { S3StorageService } from './s3storage.service';
import * as jsmediatags from 'jsmediatags';
import { Media } from './schema/media.schema';
import { getNameFromUrl } from 'src/util/string.util';
import axios from 'axios';

@Injectable()
export class MediaService {
  constructor(
    private readonly mediaRepository: MediaRepository,
    private readonly s3Service: S3StorageService,
  ) {}

  async createMedia(file: any, identifier?: string) {
    const uploadedFile = await this.s3Service.uploadFile(file);
    const mediaPayload = new CreateMediaDto();
    const typeArr = file.mimetype.split('/');
    mediaPayload.name = file.originalname;
    mediaPayload.mime = file.mimetype;
    mediaPayload.size = file.size;
    mediaPayload.altText = file.filename;
    mediaPayload.type = typeArr[0];
    mediaPayload.ext = typeArr[1];
    mediaPayload.public = true;
    mediaPayload.provider = 'aws';
    mediaPayload.url = uploadedFile.Location;
    mediaPayload.identifier = identifier;

    return this.mediaRepository.create(mediaPayload);
  }

  async createMediaWithBase64(file: string, identifier?: string) {
    const buffer = Buffer.from(
      file.replace(/^data:image\/\w+;base64,/, ''),
      'base64',
    );
    const uploadedFile = await this.s3Service.uploadFileWithBuffer(
      buffer,
      identifier,
      'image/png',
    );
    const mediaPayload = new CreateMediaDto();
    mediaPayload.name = identifier;
    mediaPayload.type = 'image';
    mediaPayload.mime = 'image/png';
    mediaPayload.ext = 'png';
    mediaPayload.size = buffer.byteLength;
    mediaPayload.url = uploadedFile.Location;
    mediaPayload.identifier = identifier;
    mediaPayload.public = true;
    mediaPayload.provider = 'aws';

    return this.mediaRepository.create(mediaPayload);
  }

  async createMultipleMedia(files: any[]) {
    const filesReq =
      Array.isArray(files) &&
      files.length &&
      files.map((file) => this.createMedia(file));
    const uploadedFiles = Promise.all(filesReq);
    return uploadedFiles;
  }

  getTags(link: string): any {
    return new Promise((resolve, reject) => {
      jsmediatags.read(link, {
        onSuccess: (tag) => {
          resolve(tag);
        },
        onError: (err) => {
          console.log('Failed to fetch tags', err);
        },
      });
    });
  }

  async createMediaWithBuffer(buffer: Buffer, name: string) {
    const uploadedFile = await this.s3Service.uploadFileWithBuffer(
      buffer,
      name,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    const mediaPayload = new CreateMediaDto();
    mediaPayload.name = name;
    mediaPayload.type = 'image';
    mediaPayload.mime =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    mediaPayload.ext = '.xlsx';
    mediaPayload.size = buffer.byteLength;
    mediaPayload.url = uploadedFile.Location;
    mediaPayload.public = true;
    mediaPayload.provider = 'aws';

    return this.mediaRepository.create(mediaPayload);
  }

  async createMediaWithLink(link: string, userId?: User) {
    const { data } = await axios.get(link);
    const uploadedFile = await this.s3Service.uploadFileWithBuffer(data);
    const media = new CreateMediaDto();
    const tags = this.getTags(link);
    if (tags) {
      media.name = tags?.title ?? getNameFromUrl(link);
      media.size = tags?.size;
      media.mime = tags?.type;
      media.type = tags?.type || 'image';
    }
    if (userId) media.owner = userId;
    media.public = true;
    media.url = uploadedFile.Location;
    media.provider = 's3';
    media.altText = 'link';

    return this.mediaRepository.create(media);
  }

  async getAllMedia() {
    return this.mediaRepository.find({});
  }

  async getMediaById(id: string) {
    return this.mediaRepository.findOne({ _id: id });
  }

  async getMediaArray(mediaIds: string[] | Media[]) {
    const mediaPromises = mediaIds.map((id) => this.getMediaById(id));
    const medias = Promise.all(mediaPromises);
    return medias;
  }

  async getMediaByOwnerId(id: User) {
    return this.mediaRepository.find({ owner: id });
  }

  async getExcelFiles() {
    return this.mediaRepository.find({ ext: '.xlsx' });
  }

  async updateMedia(id: string, updateMediaDto: UpdateMediaDto) {
    return this.mediaRepository.findOneAndUpdate({ _id: id }, updateMediaDto);
  }

  async updateMediaByClientId(id: string, updateMediaDto: UpdateMediaDto) {
    return this.mediaRepository.findOneAndUpdate(
      { clientId: id },
      updateMediaDto,
    );
  }

  async removeMedia(id: string) {
    return this.mediaRepository.findOneAndRemove({ _id: id });
  }

  async removeMediaByClientId(id: string) {
    return this.mediaRepository.findOneAndRemove({ clientId: id });
  }

  async bulkUpdate(bulkUpdateQuery: any[]) {
    const buildQuery = [];
    bulkUpdateQuery.forEach((query) => {
      buildQuery.push({ updateOne: { ...query } });
    });
    return this.mediaRepository.bulkWrite(buildQuery);
  }

  async bulkDelete(bulkDeleteQuery: any[]) {
    const buildQuery = [];
    bulkDeleteQuery.forEach((query) => {
      buildQuery.push({ deleteOne: { ...query } });
    });
    return this.mediaRepository.bulkWrite(buildQuery);
  }
}
