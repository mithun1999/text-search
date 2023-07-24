import { Controller, Get, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../../authentication/decorator/role.decorator';
import { UserType } from './enum/user.enum';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(UserType.Partner)
  @Get()
  async getAllUsers(@Req() req) {
    return this.userService.getSample();
  }
}
