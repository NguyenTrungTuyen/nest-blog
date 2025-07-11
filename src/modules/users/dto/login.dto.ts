import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator"

export class LogintAuthDto {
    @ApiProperty({ example: 'mail@gmail.com' })
    @IsEmail({}, {message:"email is not valid!"})
    @IsNotEmpty({message:"usename must be not empty!"})
    username:string;

    @ApiProperty({ example: '123456' })
    @IsNotEmpty({message:"password must be not empty!"})
    password: string;

}
