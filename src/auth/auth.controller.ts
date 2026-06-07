import { Controller, Post, Body, Res, Req, HttpStatus, HttpCode, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResponseDto, RegisterDto, SignInDto } from './dto/auth.dto';
import * as express from 'express';
import { Public } from 'src/decorators/public.decorator';
import { CookieUtil } from 'src/libs/utils/cookie.util';
import { ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("/register")
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User registered successfully",
    type: AuthResponseDto,
    headers: {
      "Set-Cookie": {
        schema: {
          type: 'string',
          example: 'refresh_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=Strict'
        }
      }
    }
  })

  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: express.Response
  ) {
    const { accessToken, refreshToken, user } = await this.authService.register(registerDto);

    CookieUtil.setRefreshToken(response, refreshToken);

    return {
      status: HttpStatus.OK,
      accessToken,
      user
    }
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("/login")
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User logged in successfully",
    type: AuthResponseDto,
    headers: {
      "Set-Cookie": {
        schema: {
          type: 'string',
          example: 'refresh_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=Strict'
        }
      }
    }
  })
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: express.Response
  ) {

    const { accessToken, refreshToken, user } = await this.authService.authenticate(signInDto);

    // console.log("Generated tokens - RefreshToken:", refreshToken)

    CookieUtil.setRefreshToken(response, refreshToken);

    return {
      status: HttpStatus.OK,
      accessToken,
      user
    }
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("/refresh")
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Token refreshed successfully",
    type: AuthResponseDto,
    headers: {
      "Set-Cookie": {
        schema: {
          type: 'string',
          example: 'refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=Strict'
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Refresh token not found or invalid"
  })
  async refresh(
    @Req() request: express.Request,
    @Res({ passthrough: true }) response: express.Response
  ) {

    const refreshToken = CookieUtil.getRefreshToken(request);
    console.log("backendRefreshRouteHit:", request.cookies)
    console.log("refreshToken:", refreshToken)
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const { accessToken, refreshToken: newRefreshToken, user } = await this.authService.refreshToken(refreshToken);

    CookieUtil.setRefreshToken(response, newRefreshToken);

    return {
      status: HttpStatus.OK,
      accessToken,
      user
    }
  }
}
