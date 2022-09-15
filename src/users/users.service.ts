import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserDocument } from 'src/schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt'
import Role from 'src/auth/role.enum';
import * as dayjs from 'dayjs'

@Injectable({

})
export class UsersService {

  private saltOrRounds = 10;

  constructor(@InjectModel(User.name, 'bookshop') private UserModel: Model<UserDocument>) { }

  async create(userData: CreateUserDto) {

    const { username } = userData;
    const CheckUsername = await this.UserModel.findOne({ username });


    if (CheckUsername) { //มีผู้ใช้งานชื่อนี้แล้ว
      throw new HttpException('username already exists', HttpStatus.BAD_REQUEST);
    }

    const hashPass = await bcrypt.hash(userData.password, this.saltOrRounds)
    userData.password = hashPass;
    userData.role = Role.User;
    const newUser = await new this.UserModel(userData);
    return newUser.save();
  }


  async findAll() {
    return await this.UserModel.find().select({
      password: 0
    });
  }

  //findbyname
  async findByName(name: string) {

    console.log(name)

    const SearchUserbyname = await this.UserModel.find({
      name: { $regex: '.*' + name + '.*' }
    });

    console.log(SearchUserbyname)

    if (SearchUserbyname.length > 0) {
      return SearchUserbyname
    } else {
      return `Is Empty`
    }

  }

  //findbyname
  async findByUserName(username: string) {
    // return `This action returns a #${id} book`;
    const SearchUserbyUsername = await this.UserModel.find({
      username: { $regex: '.*' + username + '.*' }
    });

    // console.log(Searchbook)

    if (SearchUserbyUsername.length > 0) {
      return SearchUserbyUsername
    } else {
      return `Is Empty`
    }

  }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  async update(id: string, updateUserDto: UpdateUserDto) {

    const updateUserData = await this.UserModel.findByIdAndUpdate(id, updateUserDto)
    return updateUserData;

  }

  async blockUser(id: string, updateUserDto: UpdateUserDto) {
    const updateUserData = await this.UserModel.findByIdAndUpdate(
      {_id: id },
      { status : "Block"}
    )
    return updateUserData;
  }


  async unblockUser(id: string, updateUserDto: UpdateUserDto) {
    const updateUserData = await this.UserModel.findByIdAndUpdate(
      {_id: id },
      { status : "Active"}
    )
    return updateUserData;
  }

  async remove(id: string) {
    const deleteUser = await this.UserModel.findByIdAndRemove({ _id: id }).exec();
    return deleteUser;
  }


  async insertUser(userName: string, password: string) {
    const username = userName.toLowerCase();
    const newUser = new this.UserModel({
      username,
      password,
    });
    await newUser.save();
    return newUser;
  }


  async getUser(userName: string) {
    const username = userName.toLowerCase();
    const user = await this.UserModel.findOne({ username });
    return user;
  }


  async getUsername(userName: string) {
    const username = userName.toLowerCase();
    const user = await this.UserModel.findOne({ username })
    return user;
  }


  async newUser() {
    const from = dayjs().startOf('d');
    const to = dayjs().endOf('d');
    const user = await this.UserModel.find({
      registerDate: {
        $gte: from,
        $lt: to
      }
    })
    console.log(user);
    

    return user;
  }


  async checkStatus(id : string) {
    const checkStatus = await this.UserModel.findOne({
      _id : id,
      status : "Active"
    })
    return checkStatus;
    }
  
  }


