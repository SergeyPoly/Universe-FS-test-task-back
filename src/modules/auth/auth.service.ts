import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthDto } from './dto/auth.dto';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseDto } from './dto/auth-response.dto';
import { User } from '../user/user.entity';
import { TokenPayload } from './types/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: AuthDto): Promise<AuthResponseDto> {
    const { email, password } = registerDto;

    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new UnprocessableEntityException(
        'User with this email already exists',
      );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const user = await this.userService.createUser({
      email,
      password: hashedPassword,
    });

    return this.generateToken(user);
  }

  async login(loginDto: AuthDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user);
  }

  private async generateToken(user: User): Promise<AuthResponseDto> {
    const payload: TokenPayload = { sub: user.id, email: user.email };

    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
      token_type: 'Bearer',
    };
  }
}
