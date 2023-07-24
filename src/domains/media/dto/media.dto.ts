import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { User } from 'src/domains/account/user/user/schema/user.schema';

export class CreateMediaDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  size: number;

  @IsOptional()
  @IsString()
  mime: string;

  @IsOptional()
  @IsString()
  altText: string;

  @IsOptional()
  @IsString()
  public: boolean;

  @IsOptional()
  @IsString()
  identifier: string;

  @IsOptional()
  @IsString()
  provider: string;

  @IsOptional()
  @IsString()
  ext: string;

  @IsOptional()
  @IsString()
  owner: User;
}

export class CreateMediaWithLinkDto {
  @IsNotEmpty()
  @IsString()
  link: string;
}

export class UpdateMediaDto extends PartialType(CreateMediaDto) {}
