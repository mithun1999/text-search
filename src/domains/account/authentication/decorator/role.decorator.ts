import { SetMetadata } from '@nestjs/common';
import { UserType } from '../../user/user/enum/user.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserType[]) => SetMetadata(ROLES_KEY, roles);
