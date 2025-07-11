import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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
      title, content, tags, image, author: new Types.ObjectId(authorId)
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
 async findAll(query: PostQueryDto) {
    const { authorName, tagName, page = '1', limit = '10' } = query;
    const filter: any = {};
    if(authorName){
      const authors = await this.userModel.find({
        name:{ $regex: authorName, $options: 'i' } 
      }).select('_id');

      const authorIds = authors.map(user => user._id);
      // return authorIds;

      // filter.author = { $in: authorIds.map(id => new Types.ObjectId(id as string)) };

      filter.author = { $in: authorIds }; 
      // return filter.author
      
      //   filter.author = '686f7c057f08cbf10c583509';
    }

    if (tagName) {
      filter.tags = { $regex: tagName, $options: 'i' }; 
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [ posts, total] = await Promise.all([
      this.postModel.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('author', 'name email'),
      
      this.postModel.countDocuments(filter).exec()
    ]);

    if(posts.length === 0){
      return { message: "Không có bài viết phù hợp", filter };
    };
   
    return {posts,pagination: {
      total,
      page: +page,
      limit: +limit,
      totalPages: Math.ceil(total / +limit),
    }}
  }


//  async findOne(id: string) {
//    if (!Types.ObjectId.isValid(id)) {
//       throw new BadRequestException("ID không hợp lệ")
//     }
//     const post = await this.postModel.findById(id)
//     .populate('author', 'name')
//     // .populate('comment','content' )
//     .exec()
//     if (!post) {
//       throw new NotFoundException("Không tìm thấy!")
//     }
//     return post;
//   }
  

// async findOne(id: string){
  
//   const posts = await this.postModel.aggregate([
//   {
//     $match: { _id: new Types.ObjectId(id) }
//   },
//   {
//     $lookup: {
//       from: 'comments',          // tên collection comment
//       localField: '_id',
//       foreignField: 'post',
//       as: 'comment'
//     }
//   },
//   {
//     $lookup: {
//       from: 'users',
//       localField: 'author',
//       foreignField: '_id',
//       as: 'author'
//     }
//   },
//   {
//     $unwind: '$author'
//   }
// ]);

// return posts;
// }

async findOne(id: string) {
  const posts = await this.postModel.aggregate([
    {
      $match: { _id: new Types.ObjectId(id) }
    },
    // Lấy thông tin tác giả bài viết
    {
      $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: '_id',
        as: 'author'
      }
    },
    { $unwind: '$author' },
    // Lấy comments theo bài viết
    {
      $lookup: {
        from: 'comments',
        localField: '_id',
        foreignField: 'post',
        as: 'comments'
      }
    },
    
    //Lấy tác giả của mỗi comment
    {
      $unwind: {
        path: '$comments',
        preserveNullAndEmptyArrays: true // để tránh lỗi nếu bài viết chưa có comment
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'comments.author',
        foreignField: '_id',
        as: 'comments.authorInfo'
      }
    },
    {
      $unwind: {
        path: '$comments.authorInfo',
        preserveNullAndEmptyArrays: true
      }
    },
    // Nhét authorInfo vào comment
    {
      $addFields: {
        'comments.author': '$comments.authorInfo'
      }
    },
    // Gom lại comment sau khi unwind
    {
      $group: {
        _id: '$_id',
        title: { $first: '$title' },
        content: { $first: '$content' },
        author: { $first: '$author' },
        comments: { $push: '$comments' }
      }
    }
  ]);

  return posts || null;
}

 


  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
