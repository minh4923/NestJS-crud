import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UpdateUserDto } from '../dto/update-user.dto';
import { MESSAGES } from '@nestjs/core/constants';
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async getAllUsers() {
    return this.userRepository.getAllUsers();
  }
  async getUserById(id: string) {
    const user = await this.userRepository.getUserById(id);
    if (!user) throw new NotFoundException(`User with Id: ${id} not found`);
    return user;
  }
  async updateUserById(id: string, data: UpdateUserDto) {
    const user = await this.userRepository.updateUserById(id, data);
    if (!user) throw new NotFoundException(`User with Id: ${id} not found`);
    return user;
  }
  async deleteUserById(id: string) {
    const user = await this.userRepository.deleteUserById(id);
    if (!user) throw new NotFoundException(`User with Id: ${id} not found`);
    return { message: 'User deleted successfully' };
  }
}
