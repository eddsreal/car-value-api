import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CreateUserDto } from './users.dtos';
import { User } from './users.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  const users: User[] = [];

  beforeEach(async () => {
    //  create a fake property of the users service
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: ({ email, password }: CreateUserDto) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    //  Testing Module
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup({
      email: 'test@test.com',
      password: 'asdawda',
    });
    expect(user.password).not.toEqual('asdawda');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('It throws an error if user signs up with email that is in use', async () => {
    try {
      await service.signup({ email: 'test@test.com', password: 'password' });
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
      expect(err.message).toBe('Email in use');
    }
  });

  it('It throws an error if user does not exists', async () => {
    try {
      await service.signin({
        email: 'test@tests.com',
        password: 'password',
      });
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message).toBe('User Not found');
    }
  });

  it('It throws an error if invalid password is provided', async () => {
    try {
      await service.signin({ email: 'test@test.com', password: 'passwords' });
    } catch (err) {
      console.log(err);
      expect(err).toBeInstanceOf(BadRequestException);
      expect(err.message).toBe('Bad Password');
    }
  });

  it('It returns a user if correct password is provided', async () => {
    const user = await service.signin({
      email: 'test@test.com',
      password: 'asdawda',
    });
    expect(user).toBeDefined();
  });
});
