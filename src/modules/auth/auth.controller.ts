import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from 'src/modules/auth/types/request-with-user.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register user' })
  @ApiResponse({
    status: 201,
    description: 'User has been successfully registered.',
    type: AuthResponseDto,
  })
  @Post('register')
  async register(@Body() registerDto: AuthDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'User has been successfully signed in.',
    type: AuthResponseDto,
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: AuthDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @UseGuards(AuthGuard())
  @Get('me')
  getProfile(@Req() req: RequestWithUser) {
    return req.user;
  }
}
