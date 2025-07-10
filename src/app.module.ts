import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/posts/posts.module';
import { CommentsModule } from './modules/comments/comments.module';
import { StatsModule } from './modules/stats/stats.module';

@Module({
  imports: [
      ConfigModule.forRoot({isGlobal: true}),

      MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),

      UsersModule,

      PostsModule,

      CommentsModule,

      StatsModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
