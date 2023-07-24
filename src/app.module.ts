import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import databaseConfig from "./config/database.config";
import { AuthenticationModule } from "./domains/account/authentication/authentication.module";
import { RolesGuard } from "./domains/account/authentication/provider/supabase/guard/role.guard";
import { UserModule } from "./domains/account/user/user/user.module";
import { MediaModule } from "./domains/media/media.module";
import { BullModule } from "@nestjs/bull";
import redisConfig from "./config/redis.config";
import { IdentityModule } from "./domains/identity/identity.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(databaseConfig.databaseUri),
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: redisConfig.host,
        port: Number(redisConfig.port),
        username: redisConfig.username,
        password: redisConfig.password,
      },
    }),
    UserModule,
    AuthenticationModule,
    MediaModule,
    IdentityModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: RolesGuard }],
})
export class AppModule {}
