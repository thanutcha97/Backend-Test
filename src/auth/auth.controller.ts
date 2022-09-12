import { Controller, Post, Put, Body, Param, UsePipes, ValidationPipe, Get, HttpStatus, HttpException} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private JwtService: JwtService) {}
  
  @Post('signin')
  signIn(@Body() signIn: CreateUserDto) {
    return this.authService.signIn(signIn);
  }

  @Post('signup')
  signup(@Body() signUp: CreateUserDto) {
    return this.authService.signup(signUp);
  }

}
