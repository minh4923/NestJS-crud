import { IsString, MinLength, IsNotEmpty } from 'class-validator';
export class CreatePostDto{
    @IsNotEmpty()
    @MinLength(1)
    title: string;
    
    @IsNotEmpty()
    @MinLength(1)
    content: string;
   
}