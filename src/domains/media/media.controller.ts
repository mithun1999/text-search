import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UseFilters,
  UploadedFile,
  ParseUUIDPipe,
  Req,
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MongoValidationExceptionFilter } from 'src/common/filter/MongoExpection.filter';
import { ParseObjectId } from 'src/common/validation/objectId.pipe';
import { SupabaseAuthGuard } from '../account/authentication/provider/supabase/guard/supabase.guard';
import { User } from '../account/user/user/schema/user.schema';
import { CreateMediaWithLinkDto, UpdateMediaDto } from './dto/media.dto';
import { MediaService } from './media.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('link')
  @UseFilters(MongoValidationExceptionFilter)
  async createMediaWithLink(@Body() body: CreateMediaWithLinkDto) {
    return this.mediaService.createMediaWithLink(body.link);
  }

  @UseGuards(SupabaseAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('')
  @UseFilters(MongoValidationExceptionFilter)
  async createMedia(@UploadedFile() file: any) {
    return this.mediaService.createMedia(file);
  }

  @UseGuards(SupabaseAuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  @Post('/files')
  @UseFilters(MongoValidationExceptionFilter)
  async uploadFiles(@Req() req: any, @UploadedFiles() files: any) {
    return this.mediaService.createMultipleMedia(files);
  }

  @UseGuards(SupabaseAuthGuard)
  @Get()
  async getAllMedia() {
    return this.mediaService.getAllMedia();
  }

  @Get('/excel')
  async getExcelFiles() {
    return this.mediaService.getExcelFiles();
  }

  @UseGuards(SupabaseAuthGuard)
  @Get(':id')
  async getMediaById(@Param('id', new ParseObjectId()) id: string) {
    return this.mediaService.getMediaById(id);
  }

  @UseGuards(SupabaseAuthGuard)
  @Get('owner/:id')
  async getMediaByOwnerId(@Param('id', new ParseObjectId()) id: User) {
    return this.mediaService.getMediaByOwnerId(id);
  }

  @UseGuards(SupabaseAuthGuard)
  @Patch(':id')
  async updateMedia(
    @Param('id', new ParseObjectId()) id: string,
    @Body() updateMediaDto: UpdateMediaDto,
  ) {
    return this.mediaService.updateMedia(id, updateMediaDto);
  }

  @UseGuards(SupabaseAuthGuard)
  @Patch('update/bulk')
  async updateBulkVehicle(@Body() updateMediaDto: any[]) {
    return this.mediaService.bulkUpdate(updateMediaDto);
  }

  @UseGuards(SupabaseAuthGuard)
  @Delete(':id')
  async removeMedia(@Param('id', new ParseObjectId()) id: string) {
    return this.mediaService.removeMedia(id);
  }

  @UseGuards(SupabaseAuthGuard)
  @Delete('clientId/:id')
  async removeMediaByClientId(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.mediaService.removeMediaByClientId(id);
  }

  @UseGuards(SupabaseAuthGuard)
  @Delete('delete/bulk')
  async removeBulkVehicle(@Body() deleteMediaDto: any[]) {
    return this.mediaService.bulkDelete(deleteMediaDto);
  }
}
