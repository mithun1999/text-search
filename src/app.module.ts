import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig from './config/database.config';
import { BullModule } from '@nestjs/bull';
import { PostModule } from './post/post.module';
import redisConfig from './config/redis.config';

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
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
