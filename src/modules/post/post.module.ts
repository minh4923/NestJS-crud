import { Module } from "@nestjs/common";
import { PostRepository } from "./repositories/post.repository";
import { Mongoose } from "mongoose";
import {Post,PostSchema} from "./schemas/post.schema"
import { MongooseModule } from "@nestjs/mongoose";

@Module({
    imports:[
        MongooseModule.forFeature([{name: Post.name, schema: PostSchema}]),
    ],
})
export class PostModule{}