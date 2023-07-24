import { Injectable, HttpException } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import mediaConfig from 'src/config/media.config';
import { v4 as uuid } from 'uuid';

@Injectable()
export class S3StorageService {
  private bucket: string = mediaConfig.bucketName;
  private s3 = new AWS.S3({
    accessKeyId: mediaConfig.accessKey,
    secretAccessKey: mediaConfig.secretKey,
  });

  async uploadFile(file: any): Promise<AWS.S3.ManagedUpload.SendData> {
    return this.s3Upload(
      file.buffer,
      this.bucket,
      file.originalname,
      file.mimetype,
    );
  }

  async uploadFileWithBuffer(buffer: Buffer, name?: string, mime?: string) {
    return this.s3Upload(buffer, this.bucket, name ?? `link-${uuid()}`, mime);
  }

  async uploadFileWithBlob(blob: Blob, name: string) {
    return this.s3BlobUpload(blob, this.bucket, name);
  }

  async s3Upload(
    buffer: Buffer,
    bucket: string,
    name: string,
    mimetype?: string,
  ): Promise<AWS.S3.ManagedUpload.SendData> {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: buffer,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'ap-south-1',
      },
    };
    try {
      const s3UploadRes = await this.s3.upload(params).promise();
      return s3UploadRes;
    } catch (error) {
      console.log(error);
      throw new HttpException('Unable to upload files', 400);
    }
  }

  async s3BlobUpload(
    blob: Blob,
    bucket: string,
    name: string,
    mimetype?: string,
  ): Promise<AWS.S3.ManagedUpload.SendData> {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: blob,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'ap-south-1',
      },
    };
    try {
      const s3UploadRes = await this.s3.upload(params).promise();
      return s3UploadRes;
    } catch (error) {
      console.log(error);
      throw new HttpException('Unable to upload files', 400);
    }
  }
}
