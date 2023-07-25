import { BullModule } from '@nestjs/bull';
import { CacheModule, CacheStore, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { redisStore } from 'cache-manager-redis-yet';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig from './config/database.config';
import redisConfig from './config/redis.config';
import { PostModule } from './post/post.module';
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
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async () => {
        const store = await redisStore({
          socket: {
            host: redisConfig.host,
            port: Number(redisConfig.port),
          },
          password: redisConfig.password,
          ttl: Number(redisConfig.ttl),
        });
        return {
          store: store as unknown as CacheStore,
        };
      },
      inject: [ConfigService],
    }),
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
