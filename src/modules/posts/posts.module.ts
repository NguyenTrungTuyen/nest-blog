import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { BlogModule } from 'src/databases/blog_module.schema';
import { UsersModule } from '../users/users.module';

@Module({
   imports: [
      BlogModule, UsersModule
    ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
