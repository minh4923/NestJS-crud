import { Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from '../repositories/post.repository';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { Post } from '../schemas/post.schema';
import { UserRepository } from '../../user/repositories/user.repository';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createPost(data: CreatePostDto, userId: string): Promise<Post> {
    try {
      const user = await this.userRepository.getUserById(userId);
      if (!user) {
        throw new NotFoundException(`User with Id: ${userId} not found`);
      }
      return await this.postRepository.createPost(data, userId);
    } catch (error) {
      console.error(error);
      throw new Error('Lỗi khi tạo bài viết');
    }
  }

  async getAllPost(): Promise<Post[]> {
    return this.postRepository.getAllPost();
  }

  async getPostById(id: string): Promise<Post> {
    const post = await this.postRepository.getPostById(id);
    if (!post) throw new NotFoundException(`Post with Id: ${id} not found`);
    return post;
  }

  async getAllPostByUserId(userId: string): Promise<Post[]> {
    const user = await this.userRepository.getUserById(userId);
    if (!user) throw new NotFoundException(`User with Id: ${userId} not found`);
    return await this.postRepository.getAllPostByUserId(userId);
  }

  async updatePostById(id: string, data: UpdatePostDto): Promise<Post> {
    const post = await this.postRepository.updatePostById(id, data);
    if (!post) throw new NotFoundException(`Post with Id: ${id} not found`);
    return post;
  }

  async deletePostById(id: string): Promise<{ message: string }> {
    const post = await this.postRepository.deletePostById(id);
    if (!post) throw new NotFoundException(`Post with Id: ${id} not found`);
    return { message: 'Post deleted successfully' };
  }
}
