import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { User as ISupabaseUser } from "@supabase/supabase-js";
import { SupabaseInstance } from "../../authentication/provider/supabase/supabase.instance";
import { MediaService } from "src/domains/media/media.service";
import { MediaDocument } from "src/domains/media/schema/media.schema";
import { CreateUserDto } from "./dto/user.dto";
import { User } from "./schema/user.schema";

@Injectable()
export class UserService {
  private supabaseClient = SupabaseInstance.getClient();

  constructor(
    private readonly userRepository: UserRepository,
    private readonly mediaService: MediaService
  ) {}

  getSample() {
    return "hi";
  }

  async createUser(payload: ISupabaseUser) {
    try {
      let firstName = payload?.user_metadata?.first_name;
      let lastName = payload?.user_metadata?.last_name;
      let url, image;
      let media: MediaDocument;
      if (payload?.user_metadata?.full_name) {
        const fullName = payload.user_metadata.full_name;
        const name = fullName.split(" ");
        firstName = name[0];
        lastName = name[1];
      }

      if (payload.app_metadata.provider != "email") {
        const fullName = payload.user_metadata.full_name;
        const name = fullName.split(" ");
        firstName = name[0];
        lastName = name[1];
      }

      if (payload.user_metadata.avatar_url || payload.user_metadata.picture) {
        url = payload.user_metadata.picture || payload.user_metadata.avatar_url;
        media = await this.mediaService.createMediaWithLink(url);
      }

      if (media) image = media?.id;
      else image = null;

      let userRes: User;

      userRes = await this.userRepository.findOne({
        email: payload?.email,
      });

      if (!userRes) {
        const userReq: CreateUserDto = {
          firstName,
          lastName,
          email: payload?.email,
          provider: payload.app_metadata.provider,
          phone: payload?.phone,
          providerId: payload?.id,
          image,
        };

        userRes = await this.userRepository.create(userReq);
      }

      const supabaseUpdateRes =
        await this.supabaseClient.auth.admin.updateUserById(payload.id, {
          user_metadata: {
            ...payload?.user_metadata,
            userId: userRes.id,
          },
        });
      if (supabaseUpdateRes.data?.user) return supabaseUpdateRes;
    } catch (error) {
      console.log("Error in creating the user", error);
      throw new HttpException(
        error.message ?? "Something went wrong while creating users",
        HttpStatus.EXPECTATION_FAILED
      );
    }
  }
}
