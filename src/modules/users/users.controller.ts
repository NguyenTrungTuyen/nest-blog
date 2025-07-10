import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/get_user.dto';
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LogintAuthDto } from './dto/login.dto';


@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo tài khoản người dùng' })
  @ApiBody({
    description: 'Đăng ký tài khoản mới với tên, email và mật khẩu',
    type: CreateUserDto,
 })
  @ApiResponse({ status: 201, description: 'Tạo thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  async create(@Body() createUserDto: CreateUserDto) {
    console.log('Thông tin đầu vào:', createUserDto);
    return this.usersService.create(createUserDto);
  }

  @Post('login')// ko dung local strategy
  // @Public() // public route, ko cần đăng nhập
  @ApiOperation({ summary: 'Login' })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({
     description: 'Login with email and password',
     type: LogintAuthDto,
   })
  login(@Body() LogintAuthDto: LogintAuthDto) {
    return this.usersService.signIn(LogintAuthDto);
  } 
  


  @Get()
  @ApiOperation({ summary: 'Danh sách người dùng, pagination, lọc theo "name"' })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query() query: UserQueryDto) {
    return this.usersService.findAll(query);
  }



  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
