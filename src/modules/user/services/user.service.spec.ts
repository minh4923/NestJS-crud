import { UserService } from './user.service';
import { UserRepository } from '../repositories/user.repository';
import { NotFoundException } from '@nestjs/common';
import {
  createTestingModule,
  cleanDatabase,
  closeConnection,
} from '../../../../test/setup';
import { Model, Connection } from 'mongoose';
import { UserDocument } from '../schemas/user.schema';

describe('UserService (with Docker MongoDB)', () => {
  let userService: UserService;
  let userRepository: UserRepository;
  let connection: Connection;
  let userModel: Model<UserDocument>;

  beforeAll(async () => {
    const {
      module,
      userModel: model,
      connection: dbConnection,
    } = await createTestingModule([UserService, UserRepository]);

    userModel = model;
    connection = dbConnection;
    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);

    console.log('Connected to MongoDB in Docker');
  });

  afterEach(async () => {
    await cleanDatabase([userModel]);
  });

  afterAll(async () => {
    await closeConnection(connection);
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const userDto = {
        name: 'Test User',
        email: 'test1@example.com',
        password: 'hashedpassword',
      };
      const createdUser = await userRepository.createUser(userDto);
      const result = await userService.getUserById(createdUser._id.toString());
    await new Promise((resolve) => setTimeout(resolve, 200));
      expect(result).toMatchObject({
        name: 'Test User',
        email: 'test1@example.com',
      });
      expect(result._id).toBeDefined();
    });
  });

  describe('getUserById', () => {
    it('should return user if found', async () => {
      const createdUser = await userRepository.createUser({
        name: 'Test User',
        email: 'test2@example.com',
        password: 'hashedpassword',
      });

      const result = await userService.getUserById(createdUser._id.toString());
      expect(result).toBeDefined();
      expect(result?.email).toBe('test2@example.com');
    });

    it('should throw NotFoundException if user not found', async () => {
      const nonExistentUserId = '65f4c1a8fc13ae5c80000000';
      await expect(
        userService.getUserById(nonExistentUserId),
      ).rejects.toThrowError(
        new NotFoundException(`User with Id: ${nonExistentUserId} not found`),
      );
    });
  });

  describe('deleteUserById', () => {
    it('should delete a user successfully', async () => {
      const createdUser = await userRepository.createUser({
        name: 'Test User',
        email: 'test3@example.com',
        password: 'hashedpassword',
      });

      await userService.deleteUserById(createdUser._id.toString());
      const deletedUser = await userModel.findById(createdUser._id.toString());

      expect(deletedUser).toBeNull();
    });

    it('should throw NotFoundException if user not found', async () => {
      const nonExistentUserId = '65f4c1a8fc13ae5c80000000';
      await expect(
        userService.getUserById(nonExistentUserId),
      ).rejects.toThrowError(
        new NotFoundException(`User with Id: ${nonExistentUserId} not found`),
      );
    });
  });
});
