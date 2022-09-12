import { Injectable , HttpStatus, HttpException} from '@nestjs/common';
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

@Injectable()
export class AuthService {
  
  private saltOrRounds = 10;

  constructor(private readonly UsersService: UsersService, private JwtService: JwtService ) {}

  async signIn(userDto: CreateUserDto): Promise<Object> {
    let query = {
      username: userDto.username,
    };
    let user = await this.UsersService.getUsername(query.username);
    if(user){

      let isValidPassword =  await bcrypt.compare(userDto.password, user.password);
      if(isValidPassword){
        const payload = {
          username: user.username,
          id: user._id.toString(),
          role: user.role
        }
        let token = this.JwtService.sign(payload);
        return {token: token};
      }
    }

    throw new HttpException("Invalid username or Password",HttpStatus.BAD_REQUEST);
  }


  async signup( userData : CreateUserDto) {
    
    return this.UsersService.create(userData);
    }

    // const { username } = userData;
    // const CheckUsername = await this.UserModel.findOne({ username });


    // if (CheckUsername) { //มีผู้ใช้งานชื่อนี้แล้ว
    //   throw new HttpException('username already exists', HttpStatus.BAD_REQUEST);
    // }

    // const hashPass = await bcrypt.hash(userData.password, this.saltOrRounds)
    // userData.password = hashPass;
    // userData.role = Role.User;
    // const newUser = await new this.UserModel(userData);
    // return newUser.save();


}
