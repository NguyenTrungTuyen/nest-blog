import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../users/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PostQueryDto } from './dto/get_post.dto';

@ApiTags('Posts') 
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  
  @UseGuards(JwtAuthGuard) 
  @ApiBearerAuth('jwt')
  @Post()
  create(@Body() createPostDto: CreatePostDto, @Request() req: any) {
    const authorId = req.user.userId; 
    return this.postsService.create(createPostDto, authorId);
  }

  @Get()
  // @ApiBearerAuth('jwt')
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Danh sách bài viết, có thể lọc theo tác giả và tag' })
  @ApiQuery({ name: 'authorName', required: false, type: String, description: 'Tìm theo tên tác giả' })
  @ApiQuery({ name: 'tagName', required: false, type: String, description: 'Tìm theo tên tag' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Trang hiện tại' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Số lượng bài viết mỗi trang' })    
  findAll(@Query() query: PostQueryDto) {
    return this.postsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
