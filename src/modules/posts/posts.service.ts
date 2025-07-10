import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from 'src/databases/schemas/post.schema';

@Injectable()
export class PostsService {

   constructor(
      @InjectModel(Post.name) private postModel: Model<Post>,
    ) {}
  // check title
  isTitleExist = async (title: string) => {
    const post = await this.postModel.exists({ title });
    if (post) {
      console.log(`Title: ${title} đã được sử dụng!`);
      return true;
    }
  }
  // them bai viet moi  
 async create(createPostDto: CreatePostDto) {
    const { title, content, tags, image } = createPostDto;

    // check title
    const isExist = await this.isTitleExist(title);
    if (isExist === true) {
      throw new Error(`Tiêu đề đã tồn tại: ${title}. Vui lòng sử dụng tiêu đề khác!`);
    }

    // create post
    const post = await this.postModel.create({
      title, content, tags, image
    });

    console.log("Tạo bài viết thành công!");
    return {
      _id: post._id,
      message: 'Tạo bài viết thành công!',
    }
  }

  findAll() {
    return `This action returns all posts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
