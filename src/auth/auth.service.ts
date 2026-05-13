import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto, SignInDto } from './dto/auth.dto';
import { PrismaService } from 'src/database/prisma.service';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/types/user';
import { NotificationsService } from 'src/notifications/notifications.service';

interface TokenPayload {
  sub: string;
  username: string
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private userService: UsersService,
    private resendService: NotificationsService,
    private jwtService: JwtService
  ) { }

  async generateAccessToken(tokenPayload: TokenPayload): Promise<string> {
    const accessToken = await this.jwtService.signAsync(tokenPayload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '1d'
    })
    return accessToken
  }

  async generateRefreshToken(tokenPayload: TokenPayload): Promise<string> {
    const refreshToken = await this.jwtService.signAsync(tokenPayload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d'
    })
    await this.userService.createRefreshToken(tokenPayload.sub, refreshToken)
    return refreshToken
  }

  async authenticate(signInDto: SignInDto) {
    const authenticated = await this.validate(signInDto)

    if (!authenticated) {
      throw new UnauthorizedException()
    }
    console.log("authenticated:", authenticated)
    return this.signIn(authenticated)
  }

  async validate(signInDto: SignInDto) {
    const user = await this.userService.findUserByEmail(signInDto.email);

    if (!user) {
      throw new UnauthorizedException("Your email doesn't exist")
    }

    const validatePsw = await bcrypt.compare(signInDto.password, user?.password)

    if (validatePsw) {
      return user
    }
    throw new UnauthorizedException("Your password is incorrect")
  }

  async signIn(user: User) {
    const username = user.firstName + " " + user.lastName

    const tokenPayload = {
      sub: user.id,
      username,
      role: user.role
    }

    const accessToken = await this.generateAccessToken(tokenPayload)
    const refreshToken = await this.generateRefreshToken(tokenPayload)

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username,
        role: user.role
      }
    }
  }


  async register(registerDto: RegisterDto) {
    console.log("RegisterDTO:", registerDto)
    const existingUser = await this.userService.findUserByEmail(registerDto.email)
    if (existingUser) {
      throw new ConflictException('User already exists')
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10)

    const user = await this.userService.createUser({
      ...registerDto,
      password: hashedPassword
    })

    await this.resendService.sendWelcomeEmail(user.email, user.firstName + " " + user.lastName)
    console.log("already sent email")
    return this.signIn(user)
  }

  async refreshToken(oldRefreshToken: string) {
    const payload = await this.jwtService.verifyAsync(oldRefreshToken, {
      secret: process.env.JWT_REFRESH_SECRET
    })

    const user = await this.prisma.user.findFirst({
      where: {
        id: payload.sub
      }
    })

    if (!user) {
      throw new UnauthorizedException()
    }

    if (!user.refreshToken) {
      throw new UnauthorizedException("Invalid refresh token")
    }

    const isTokenValid = await bcrypt.compare(oldRefreshToken, user.refreshToken)

    if (!isTokenValid) {
      throw new UnauthorizedException("Invalid refresh token")
    }
    return this.signIn(user)
  }
}
