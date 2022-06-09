import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './users.dtos';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Post('/signup')
  createUser(@Body() args: CreateUserDto) {
    return this.usersService.create(args);
  }
}
