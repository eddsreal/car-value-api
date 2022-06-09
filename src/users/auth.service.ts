import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _script } from 'crypto';
import { promisify } from 'util';
import { CreateUserDto, SignUserDto } from './users.dtos';
const scrypt = promisify(_script);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  async signup(args: CreateUserDto) {
    //  See if email is in use
    const users = await this.usersService.find(args.email);
    if (users.length) {
      throw new BadRequestException('Email in use');
    }

    //  Hash User Password
    //  Generate Salt
    const salt = randomBytes(8).toString('hex');

    //  Hash the salt and the password together
    const hash = (await scrypt(args.password, salt, 32)) as Buffer;

    //  Join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex');

    // Create New User
    const user = await this.usersService.create({
      email: args.email,
      password: result,
    });

    //  Return User
    return user;
  }

  async signin(args: SignUserDto) {
    const [user] = await this.usersService.find(args.email);
    if (!user) {
      throw new NotFoundException('User Not found');
    }
    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(args.password, salt, 32)) as Buffer;

    if (storedHash === hash.toString('hex')) {
      return user;
    } else {
      throw new BadRequestException('Bad Password');
    }
  }
}
