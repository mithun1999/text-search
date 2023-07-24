import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthUser, UserResponse } from "@supabase/supabase-js";
import { Request } from "express";
import { ExtractJwt } from "passport-jwt";
import { Strategy } from "passport-strategy";
import { UserService } from "src/domains/account/user/user/user.service";
import { SupabaseInstance } from "../supabase.instance";

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy, "supabase") {
  private supabaseClient = SupabaseInstance.getClient();
  private extractor = ExtractJwt.fromAuthHeaderAsBearerToken();

  constructor(private readonly userService: UserService) {
    super();
  }

  async validate(payload: AuthUser): Promise<AuthUser> {
    return payload;
  }

  authenticate(req: Request): void {
    const accessToken = this.extractor(req);
    if (!accessToken) {
      this.fail("Unauthorized", 401);
      return;
    }

    this.supabaseClient.auth
      .getUser(accessToken)
      .then((res) => this.validateSupabaseResponse(res))
      .catch((err) => {
        this.fail(err.message, 401);
      });
  }

  private async validateSupabaseResponse(res: UserResponse) {
    if (res.data?.user?.user_metadata?.userId) {
      const result = await this.validate(res.data as any);
      if (result) {
        this.success(result, {});
        return;
      }
    } else if (res.data?.user) {
      const userDbRes = await this.userService.createUser(res?.data?.user);
      if (userDbRes) this.success(userDbRes, {});
      return;
    }
    this.fail("Unauthorized", 401);
    return;
  }
}
