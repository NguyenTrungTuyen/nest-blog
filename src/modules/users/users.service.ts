import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../../databases/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { comparePasswordHelper, hashPasswordHelper } from '../common/utils'; // Giả sử bạn đã định nghĩa hàm này trong utils
import { UserQueryDto } from './dto/get_user.dto';
import { JwtService } from '@nestjs/jwt';
import { LogintAuthDto } from './dto/login.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService:JwtService,
  ) {}

//check maill
  isEmailExist = async (email: string) => {
    const user = await this.userModel.exists({ email });
    if (user) {
      console.log(`Email: ${email} đã được sử dụng!`);
      return true;
    }
  }
//register
async create(createUserDto: CreateUserDto) {
    const { name, password, email } = createUserDto;

    //check mail
    const isExist = await this.isEmailExist(email);
    if (isExist === true) {
      throw new BadRequestException(`Email đã tồn tại: ${email}. Vui lòng sử dụng email khác!`);
    }

    // Hash password 
    const hashedPassword = await hashPasswordHelper(password) ; 

    //create user
    const user = await this.userModel.create({
      name, email, password: hashedPassword
    });
     
    //send mail
    //xoa cache
    console.log("Tạo tài khoản thành công!");
    return {
      _id: user._id,
      message: 'Tạo tài khoản thành công!, vui lòng kiểm tra email để xác nhận tài khoản.',
    }

  }

// tìm kiếm user theo email 
  async findByEmail (email: string){
    return await this.userModel.findOne({email})
  }

// login
  async signIn(acount :LogintAuthDto): Promise<any> {
    const user = await this.findByEmail(acount.username);
    if (!user) {
       throw new UnauthorizedException('Tài khoản không tồn tại!');
    }
    const isValidPassword = await comparePasswordHelper(acount.password, user.password)
    if (!isValidPassword) {
      throw new UnauthorizedException("Tên đăng nhập hoặc mật khẩu không đúng!");
    }
    console.log("Đăng nhập thành công!");

    const payload = { sub:user._id, username: user.email};
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
    
  }

  // danh sach user, phan trang, tim kiem
 async findAll( query : UserQueryDto) {
   const { search, page = '1', limit = '10' } = query;
   const filter : any = {};
    if (search) {
      filter.name = { $regex: search, $options: 'i' }; // Tìm kiếm không phân biệt chữ hoa chữ thường
    }
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const [ data, total ] = await Promise.all([
      this.userModel.find(filter).skip(skip).limit(limitNumber).exec(), 
      this.userModel.countDocuments(filter).exec()
    ]);

    return{
      data,
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    }

  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
