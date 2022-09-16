import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User } from '../users/entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/schema/user.schema';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import Role from './role.enum';
import * as dayjs from 'dayjs';

@Injectable()
export class AuthService {

  private saltOrRounds = 10;
  private passwordIsWrong = [];

  constructor(private readonly UsersService: UsersService, private JwtService: JwtService) { }

  async signIn(userDto: CreateUserDto, ip: String): Promise<Object> {
    let query = {
      username: userDto.username,
    };
    let user = await this.UsersService.getUsername(query.username);
    
    // หาตำแหน่งข้อมูลผู้ใช้ล็อคอินผิดโดยไอพี
    let userLogIndex = this.passwordIsWrong.findIndex(element => element.ip === ip);

    if(userLogIndex != -1 && this.passwordIsWrong[userLogIndex].count >= 3) 
    {
      
      
      const user = this.passwordIsWrong[userLogIndex];
      let lastDate = dayjs().format();
      if(user.count == 3 && lastDate < user.date )
      {
          let date1 = dayjs(lastDate);
          let date2 = dayjs(user.date);
          return {
            message: 'Block',
            second: `Count down second: ${date2.diff(date1, 'second')}`
          }
      }

      if(user.count == 3 && lastDate > user.date )
      {
        this.passwordIsWrong.splice(userLogIndex, 1);
        userLogIndex = -1;
      }
    }

    if (user) {

      let isValidPassword = await bcrypt.compare(userDto.password, user.password);
      if (isValidPassword) {
        const payload = {
          username: user.username,
          id: user._id.toString(),
          role: user.role
        }
        let token = this.JwtService.sign(payload);
        return { token: token };
      } else {
        if (userLogIndex == -1) {
          this.passwordIsWrong.push({
            ip: ip,
            count: 1,
            date: null
          })
          throw new HttpException("Invalid username or Password", HttpStatus.BAD_REQUEST);
        }
        this.passwordIsWrong[userLogIndex].count += 1;
        if (this.passwordIsWrong[userLogIndex].count == 3) {
          
          
          this.passwordIsWrong[userLogIndex].date = dayjs().add(30, 'second').format();
          return {
            message: 'Block Request 30 second'
          }
        }
      }
    } 
    else {
      if (userLogIndex == -1) {
         this.passwordIsWrong.push({
          ip: ip,
          count: 1,
          date: null
        })
        throw new HttpException("Invalid username or Password", HttpStatus.BAD_REQUEST);
      }
      this.passwordIsWrong[userLogIndex].count += 1;

      if (this.passwordIsWrong[userLogIndex].count == 3) {

        this.passwordIsWrong[userLogIndex].date = dayjs().add(30, 'second').format();
        return {
          message: 'Block Request 30 second'
        }
      }
    }

    throw new HttpException("Invalid username or Password", HttpStatus.BAD_REQUEST);
  }


  async signup(userData: CreateUserDto) {

    return this.UsersService.create(userData);
  }



}
