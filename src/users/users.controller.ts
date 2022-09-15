import { UseGuards, Request, Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import Role from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/role.guard';



@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, ) {}

  
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Get()
  findAll(@Request() req) {

    console.log(req.user.username);
    return this.usersService.findAll();
  
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Get('findNewUser')
  findNewUser() {
    return this.usersService.newUser()
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Get('findByName/:name')
  findByName( @Param('name') name : string) {
    return this.usersService.findByName(name);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Get('findByUserName/:username')
  findByUserName( @Param('username') username : string ) {
    return this.usersService.findByUserName(username);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Patch('blockUser/:id')
  blockUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.blockUser(id, updateUserDto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Patch('unblockUser/:id')
  unblockUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.unblockUser(id, updateUserDto);
  }
 
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }


}
