import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { UserService } from './user.service';
import { UserRepository } from '../repositories/user.repository';
import { User, UserSchema, UserDocument } from '../schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

describe('UserService (with Docker MongoDB)', () => {
  let userService: UserService;
  let userRepository: UserRepository;
  let model: Model<UserDocument>;
  let connection: Connection;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(process.env.MONGODB_URI as string),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      providers: [UserService, UserRepository],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
    model = module.get<Model<UserDocument>>(getModelToken(User.name));
    connection = module.get<Connection>(getConnectionToken());

    console.log('Connected to MongoDB in Docker');
  });

  afterEach(async () => {
    await model.deleteMany({});
  });

  afterAll(async () => {
    await connection.close();
    console.log('MongoDB connection closed');
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
      const deletedUser = await model.findById(createdUser._id.toString());

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
