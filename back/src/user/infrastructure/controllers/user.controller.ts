import { ValidRoles } from '@auth/domain/interfaces/valid-roles';
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Auth } from '@auth/infrastructure/decorators';
import { UserService } from '@user/application/services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.createUser(createUserDto);
  // }

  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  @Delete(':id')
  @Auth(ValidRoles.admin) // Use the Auth decorator to protect this route
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
