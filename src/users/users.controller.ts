import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseInterceptors,
} from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/currentUser.decorator';
import { CurrentUserInterceptor } from './interceptors/currentUser.interceptor';
import {
  CreateUserDto,
  SignUserDto,
  UpdateUserDto,
  UserDto,
} from './users.dtos';
import { UsersService } from './users.service';

@Controller('auth')
@Serialize(UserDto)
@UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  // @Get('/whoami')
  // whoAmI(@Session() session: any) {
  //   return this.usersService.findOne(session.userId);
  // }

  @Get('/whoami')
  whoAmI(@CurrentUser() user: any) {
    return user;
  }

  @Post('/signup')
  async signup(@Body() args: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(args);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signin(@Body() args: SignUserDto, @Session() session: any) {
    const user = await this.authService.signin(args);
    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Get('/:id')
  async findUser(@Param('id') id: number) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User Not found');
    }
    return user;
  }

  @Get('/')
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: number, args: UpdateUserDto) {
    return this.usersService.update(id, args);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
