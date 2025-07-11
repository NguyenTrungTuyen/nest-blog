import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { BlogModule } from 'src/databases/blog_module.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports:[
      BlogModule, UsersModule
  ],

  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
