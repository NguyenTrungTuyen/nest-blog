import { ApiProperty } from "@nestjs/swagger";
import {  IsArray, IsNotEmpty, IsOptional, IsString, Max, MinLength } from "class-validator"

export class CreatePostDto {
   
    @ApiProperty({ example: 'Post Title' , description: 'Bài viết '})
    @IsNotEmpty({message:"Tiêu đề không được để trống!"})
    @IsString()
    title: string;

    @ApiProperty({ example: 'Nội dung.........' , description: 'Nội dung bài viết'})
    @IsNotEmpty({message:"Nội dung không được để trống!"})
    @IsString()
    content:string;

    @ApiProperty({ example: '["tag1", "tag2"]', description: 'Danh sách các thẻ phân loại bài viết', isArray: true  })
    @IsOptional()
    @IsArray()
    @IsString({ each: true }) // mỗi phần tử phải là string
    tags?: string[];

    @ApiProperty({  description: 'URL hình ảnh đại diện cho bài viết// chuwa xong', required: false })
    @IsOptional()
    image?:string;
}

