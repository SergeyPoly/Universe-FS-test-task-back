import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user/user.service';
import { TokenPayload } from './types/token-payload.interface';
import { UserResponseDto } from 'src/modules/user/dto/user-response.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      secretOrKey: process.env.JWT_SECRET || 'your_jwt_secret',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: TokenPayload): Promise<UserResponseDto> {
    const { sub } = payload;
    const user = await this.userService.findById(sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
