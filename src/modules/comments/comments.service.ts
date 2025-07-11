import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/databases/schemas/user.schema';
import { Post } from 'src/databases/schemas/post.schema';
import { Comment } from 'src/databases/schemas/comment.schema'

@Injectable()
export class CommentsService {
   constructor(
      @InjectModel(Comment.name) private commentModel: Model<Comment>,
      @InjectModel(User.name) private userModel: Model<User>,
      @InjectModel(Post.name) private postModel: Model<Post>,
    ) {}

 async create(createCommentDto: CreateCommentDto, userId: string) {
    const { content, postId} = createCommentDto;

    const comment = await this.commentModel.create({
    content,
    post: new Types.ObjectId(postId),
    author: new Types.ObjectId(userId),
  });
  return comment;
  }

  findAll() {
    return `This action returns all comments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
