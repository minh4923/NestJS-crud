import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostDocument, Post } from '../schemas/post.schema';
@Injectable()
export class PostRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}
  async createPost(data: CreatePostDto, userId: string): Promise<Post> {
    const newPost = new this.postModel({ ...CreatePostDto, author: userId });
    return newPost.save();
  }
  async getAllPost(): Promise<Post[]> {
    return this.postModel.find().exec();
  }
  async getPostById(id: string): Promise<Post | null> {
    return this.postModel.findById(id).exec();
  }
  async getAllPostByUserId(UserId: string): Promise<Post[]> {
    return this.postModel.find({ Author: UserId }).exec();
  }
  async updatePostById(id: string, data:UpdatePostDto ): Promise<Post | null> {
    return this.postModel.findByIdAndUpdate(id, UpdatePostDto).exec();
  }
  async deletePostById(id: string): Promise<boolean> {
    const user = this.postModel.findByIdAndDelete(id);
    return user !== null;
  }
}
