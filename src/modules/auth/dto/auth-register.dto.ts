import { IsEmail, IsString, MinLength } from "class-validator";
export class RegisterDto{
    @IsString()
    @MinLength(3)
    name: string;
    
    @IsEmail()
    @MinLength(3)
    email: string;

    @IsString()
    @MinLength(6)
    password: string;
}