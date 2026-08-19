import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ChangePasswordDto, GetUserDetailsResponse, GetUsersQueryDto, UpdateUserDto, UserResponseDto } from './dto/user.dto';
import { ApiPaginatedResponse } from 'src/decorators/api.paginated-decorator';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { Role, Roles } from 'src/decorators/role.decorators';


@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  //Get all users by admin
  @Get()
  @Roles(Role.ADMIN)
  @ApiPaginatedResponse(UserResponseDto)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async findAll(@Query() query: GetUsersQueryDto) {
    return this.usersService.findAllUsers(query)
  }

  //Current User
  @Get('me')
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserResponseDto
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async findMe(@CurrentUser() user: any) {
    return this.usersService.findUserById(user.sub)
  }

  @Patch('me')
  @ApiResponse({ status: HttpStatus.OK, type: UserResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async updateProfile(@CurrentUser() user: any, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(user.sub, updateUserDto)
  }

  @Post('/me/change-password')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password changed successfully',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async changePassword(@CurrentUser() user: any, @Body() changePasswordDto: ChangePasswordDto) {
    return this.usersService.changePassword(user.sub, changePasswordDto)
  }


  @Get(':id')
  @ApiResponse({ status: HttpStatus.OK, type: GetUserDetailsResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async findUserById(@Param('id') id: string) {
    return this.usersService.findUserById(id)
  }

  //Verify student by admin
  @Post('student-verify/:id')
  @Roles(Role.ADMIN)
  @ApiResponse({ status: HttpStatus.OK, type: UserResponseDto, description: 'User verified successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async verifyUser(@Param('id') id: string, @CurrentUser() user: any) {
    return this.usersService.verifyUser(id, user.sub)
  }

  // //Update user by admin
  // @Patch(':id')
  // @ApiResponse({ status: HttpStatus.OK, type: UserResponseDto })
  // @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  // async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.updateUser(id, updateUserDto)
  // }

  //Delete user by admin
  @Delete(':id')
  @ApiResponse({ status: HttpStatus.OK, description: 'User deleted successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id)
  }
}
