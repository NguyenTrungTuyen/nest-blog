import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator"

export class LogintAuthDto {
    @ApiProperty({ example: 'Your email' })
    @IsEmail({}, {message:"email is not valid!"})
    @IsNotEmpty({message:"usename must be not empty!"})
    username:string;

    @ApiProperty({ example: 'Password' })
    @IsNotEmpty({message:"password must be not empty!"})
    password: string;

}
