import { IsOptional, MinLength } from "class-validator";
export class UpdatePostDto {
    @IsOptional()
    @MinLength(1)
    title?:string;
    
    @IsOptional()
    @MinLength(1)
    content?:string;
}