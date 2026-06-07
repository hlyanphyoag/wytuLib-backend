import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { RegisterDto } from 'src/auth/dto/auth.dto';
import { ChangePasswordDto, GetUserDetailsResponse, GetUsersQueryDto, UpdateUserDto, UserResponseDto } from './dto/user.dto';
import { toDto } from 'src/libs/utils/toDto';
import * as bcrypt from 'bcrypt'
import { BorrowStatus, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService
  ) { }


  async createRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10)

    await this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        refreshToken: hashedRefreshToken
      }
    })
  }


  async createUser(createUserDto: RegisterDto) {


    const user = await this.prisma.user.create({
      data: {
        ...createUserDto
      }
    })
    return user
  }

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email
      }
    })
  }

  async findUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id
      },
      include: {
        borrows: {
          select: {
            id: true,
            borrowDate: true,
            returnDate: true,
            dueDate: true,
            status: true,
            book: {
              select: {
                id: true,
                title: true,
                subtitle: true,
                isbn: true,
                coverImage: true,
                coverColor: true
              }
            }
          }
        }
      }
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return toDto(GetUserDetailsResponse, user)
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {

    const user = await this.prisma.user.update({
      where: {
        id
      },
      data: {
        ...updateUserDto
      }
    })

    const updatedUser = toDto(UserResponseDto, user)
    return updatedUser
  }

  async deleteUser(id: string) {
    await this.prisma.user.delete({
      where: {
        id
      }
    })
    return {
      status: HttpStatus.OK,
      message: 'User deleted successfully.'
    }
  }

  async findAllUsers(query: GetUsersQueryDto) {
    const { page = 1, limit = 10, sortBy = 'registeredAt', sortOrder = 'desc', search, role } = query

    const skip = (page - 1) * limit
    const take = Number(limit)

    const where = {
      ...(role && { role }),
      ...(search && {
        OR: [
          { email: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { firstName: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { lastName: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { phone: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { studentId: { contains: search, mode: Prisma.QueryMode.insensitive } },
        ],
      })
    }

    const data = await this.prisma.user.findMany({
      where,
      skip,
      take,
      orderBy: {
        [sortBy]: sortOrder
      }
    })

    const total = await this.prisma.user.count({ where })

    const totalPages = Math.ceil(total / limit)
    const hasNextPage = page < totalPages
    const hasPreviousPage = page > 1

    const results = toDto(UserResponseDto, data)

    const metaData = {
      page,
      limit,
      total,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    }

    return {
      metaData,
      results
    }
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword, confirmPassword } = changePasswordDto

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId
      }
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('New password and confirm password do not match')
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password)
    if (isSamePassword) {
      throw new BadRequestException(
        'New password cannot be the same as current password'
      )
    }

    const matchPsw = await bcrypt.compare(currentPassword, user.password)
    if (!matchPsw) {
      throw new BadRequestException('Current password is incorrect')
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        password: hashedPassword
      }
    })

    return {
      status: HttpStatus.OK,
      message: 'Password changed successfully'
    }
  }
  async verifyUser(userId: string, adminId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    if (user.isVerified) {
      throw new BadRequestException('User is already verified')
    }

    const admin = await this.prisma.user.findUnique({
      where: { id: adminId }
    })

    const verifiedByName = admin ? `${admin.firstName} ${admin.lastName}`.trim() : adminId

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        isVerified: true,
        verifiedBy: verifiedByName
      }
    })

    return toDto(UserResponseDto, updatedUser)
  }
}
