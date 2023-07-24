import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../../decorator/role.decorator';
import { UserType } from 'src/domains/account/user/user/enum/user.enum';
import { SupabaseAuthGuard } from './supabase.guard';

@Injectable()
export class RolesGuard extends SupabaseAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<UserType[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (!requiredRoles) {
        return true;
      }
      const authRes = await super.canActivate(context);
      if (authRes) {
        const req = context.switchToHttp().getRequest();
        const user = req?.user;
        const userType =
          user?.user?.user_metadata?.userType ||
          user?.data?.user?.user_metadata?.userType;

        return requiredRoles.some((role) => role === userType);
      } else {
        throw new UnauthorizedException();
      }
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
