import { IsOptional, IsString, IsNumberString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PostQueryDto {
  @ApiPropertyOptional({ example: 'Your Name', description: 'Tìm theo tên tác giả' })
  @IsOptional()
  @IsString()
  authorName?: string;

  @ApiPropertyOptional({ example: 'tag1', description: 'Tìm theo tagname' })
  @IsOptional()
  @IsString()
  tagName?: string;


  @ApiPropertyOptional({ example: '1', description: 'Trang hiện tại' })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({ example: '10', description: 'Số lượng mỗi trang' })
  @IsOptional()
  @IsNumberString()
  limit?: string;
}
