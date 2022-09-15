import { Controller, Post, Put, Body, Param, UsePipes, ValidationPipe, Get, HttpStatus, HttpException,HttpCode, Ip} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RateLimit } from 'nestjs-rate-limiter'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private JwtService: JwtService) {}
  
  // @RateLimit({ keyPrefix: 'signin', points: 1, duration: 60, errorMessage: 'Accounts cannot be created more than once in per minute' })
  @Post('signin')
  signIn(@Body() signIn: CreateUserDto, @Ip() ip) {
    return this.authService.signIn(signIn, ip);
  }

  @Post('signup')
  signup(@Body() signUp: CreateUserDto) {
    return this.authService.signup(signUp);
  }


}
