import { ApiProperty } from "@nestjs/swagger";
import {  IsNotEmpty, IsOptional, Max, MinLength } from "class-validator"

export class CreatePostDto {
    @ApiProperty({description: 'ID tác giả/ chuwa co login/', example: '60c72b2f9b1d4c001c8e4f3a'})
    @IsNotEmpty({message:"ID không được để trống!"})
    author:string;

    @ApiProperty({ example: 'Post Title' , description: 'Tiêu đề bài viết'})
    @MinLength(1, { message: 'Tên bài viết phải có ít nhất 1 ký tự' })
    @Max(255, { message: 'Tên bài viết không được quá 255 ký tự' })
    @IsNotEmpty({message:"Tiêu đề không được để trống!"})
    title: string;

    @ApiProperty({ example: 'This is the content of the post.' , description: 'Nội dung bài viết'})
    content:string;

    @ApiProperty({ example: 'tag1, tag2', description: 'Danh sách các thẻ phân loại bài viết'})
    @IsOptional()
    tags?:string;

    @ApiProperty({  description: 'URL hình ảnh đại diện cho bài viết// chuwa xong'})
    @IsOptional()
    image?:string;
}

