import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from 'src/databases/schemas/post.schema';
import { PostQueryDto } from './dto/get_post.dto';
import { User } from 'src/databases/schemas/user.schema';

@Injectable()
export class PostsService {

   constructor(
      @InjectModel(Post.name) private postModel: Model<Post>,
      @InjectModel(User.name) private userModel: Model<User>,
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
 async create(createPostDto: CreatePostDto, authorId: string) {
    const { title, content, tags, image } = createPostDto;

    // check title
    const isExist = await this.isTitleExist(title);
    if (isExist === true) {
      throw new BadRequestException(`Tiêu đề đã tồn tại: ${title}. Vui lòng sử dụng tiêu đề khác!`);
    }

    // create post
    const post = await this.postModel.create({
      title, content, tags, image, author: authorId
    });

    console.log("Tạo bài viết thành công!");
   // Sau khi tạo xong, populate lại để lấy tên tác giả
    const populatedPost = await this.postModel
      .findById(post._id)
      .populate('author', 'name email'); // lấy các trường mong muốn

    return {
      _id: post._id,
      title: post.title,
      author: (populatedPost?.author as any)?.name ?? "Dấu tên!", // hoặc .email nếu muốn
      message: 'Tạo bài viết thành công!',
    }
  }

  // danh sach bai viet theo tagname, authorName, page, limit
//  async findAll(query: PostQueryDto) {
//     const { authorName, tagName, page = '1', limit = '10' } = query;
//     const filter: any = {};

//     if(authorName){
//       const authors = await this.userModel.find({
//         name:{ $regex: authorName, $options: 'i' } // Tìm kiếm không phân biệt chữ hoa chữ thường
//       }).select('_id').exec();

//       const authorIds = authors.map(author => author._id);
//       filter.author = { $in: authorIds }; // Lọc theo ID của tác giả
//     }


//     if (tagName) {
//       filter.tags = { $regex: tagName, $options: 'i' }; // Tìm kiếm không phân biệt chữ hoa chữ thường
//     }
//     const skip = (parseInt(page) - 1) * parseInt(limit);
//     const [ posts, total] = await Promise.all([
//       this.postModel.find(filter)
//       .skip(skip)
//       .limit(parseInt(limit))
//       .populate('author', 'name email'),
      
//       this.postModel.countDocuments(filter).exec()
//     ]);

//    return {
//     data: posts.map(post => ({
//       _id: post._id,
//       title: post.title,
//       content: post.content,
//       tags: post.tags,
//       image: post.image,
//       author: typeof post.author === 'object' && post.author !== null && 'name' in post.author
//         ? (post.author as any).name
//         : 'Không rõ',
//     })),
//     pagination: {
//       total,
//       page: +page,
//       limit: +limit,
//       totalPages: Math.ceil(total / +limit),
//     },
//   };
//   }
async findAll(query: PostQueryDto) {
  const { authorName, tagName, page = '1', limit = '10' } = query;
  const filter: any = {};

  // Xử lý tìm kiếm theo tên tác giả
  if (authorName) {
    const cleanedAuthorName = authorName.trim();
    const authors = await this.userModel
      .find({
        name: { $regex: cleanedAuthorName, $options: 'i' },
      })
      .select('_id')
      .exec();
    const authorIds = authors.map((author) => author._id);
    if (authorIds.length === 0) {
      throw new Error('Không tìm thấy tác giả với tên này');
    }
    filter.author = { $in: authorIds };
  }

  // Xử lý tìm kiếm theo tag
  if (tagName) {
    filter.tags = { $elemMatch: { $regex: tagName, $options: 'i' } };
  }

  // Xử lý phân trang
  const pageNum = isNaN(parseInt(page)) ? 1 : parseInt(page);
  const limitNum = isNaN(parseInt(limit)) ? 10 : parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Truy vấn bài post và tổng số
  const [posts, total] = await Promise.all([
    this.postModel
      .find(filter)
      .skip(skip)
      .limit(limitNum)
      .populate('author', 'name email'),
    this.postModel.countDocuments(filter).exec(),
  ]);

  // Trả về kết quả
  return {
    data: posts.map((post) => ({
      _id: post._id,
      title: post.title,
      content: post.content,
      tags: post.tags,
      image: post.image,
      author:
        typeof post.author === 'object' &&
        post.author !== null &&
        'name' in post.author
          ? (post.author as any).name
          : 'Không rõ',
    })),
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  };
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
