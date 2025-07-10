import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from "class-validator"

export class CreateUserDto {
    @ApiProperty({ example: 'mail@gmail.com' })
    @IsNotEmpty({message:"Email không được để trống!"})
    @IsEmail({}, { message: 'Email không hợp lệ' })
    email:string;

    @ApiProperty({ example: '123456' })
    @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
    @IsNotEmpty({message:"Mật khẩu không được để trống"})
    password: string;

    @ApiProperty({ example: 'Your Name' })
    @IsOptional()
    name?:string;
}
