import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(2)
  firstName: string;

  @IsOptional()
  lastName?: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  provider: string;

  @IsOptional()
  providerId: string;

  @IsOptional()
  phone: string;

  @IsOptional()
  image: string;
}

export class CreateUserByProviderDto {
  @IsNotEmpty()
  @MinLength(2)
  firstName: string;

  lastName?: string;

  email?: string;

  @IsNotEmpty()
  provider: string;

  @IsNotEmpty()
  providerId: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
