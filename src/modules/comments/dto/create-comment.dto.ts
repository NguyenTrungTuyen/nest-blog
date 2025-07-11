import { ApiProperty } from "@nestjs/swagger";
import {  IsArray, IsNotEmpty, IsOptional, IsString, Max, MinLength } from "class-validator"

export class CreateCommentDto {
   
    @ApiProperty({ example: 'Comment 1' , description: 'Đã xem và đánh giá....'})
    @IsNotEmpty({message:"Vui lòng nhập nội dung cmt!"})
    @IsString()
    content: string;

    @ApiProperty({example: '6870d50689212f21115da86c', description: 'ID bài viết'})
    @IsNotEmpty({message:"ID không được để trống!"})
    postId:string;
}

