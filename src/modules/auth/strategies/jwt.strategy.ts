import { ExtractJwt, Strategy } from 'passport-jwt';
import { HttpException, HttpStatus, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/modules/user/user.entity';
import { UserResDto } from 'src/modules/user/dto/user-res.dto';
import { UserService } from 'src/modules/user/user.service';
import { HttpRequestContextService } from 'src/shared/http-request-context/http-request-context.service';

const logger = new Logger();

type JwtPayload = Pick<User, 'id' | 'email' | 'roles'> & { iat: number; exp: number };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private readonly httpContext: HttpRequestContextService,
    private configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('auth.secret'),
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload.id) {
      throw new UnauthorizedException();
    }

    const exp = payload.exp;
    if (exp && exp * 1000 < Date.now()) {
      logger.warn(`The token is expired at %j`, new Date(exp));
      throw new HttpException({}, HttpStatus.UNAUTHORIZED);
    }

    const user = await this.userService.findOne({ id: payload.id });
    if (!user.isActive) {
      throw new HttpException({}, HttpStatus.FORBIDDEN);
    }

    if (!user) {
      logger.warn(`User %j is not found or not active %j`, user?.email);
      throw new HttpException({}, HttpStatus.UNAUTHORIZED);
    }

    const currUser: UserResDto = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      roles: user.roles,
    };

    this.httpContext.setUser(currUser);

    return currUser;
  }
}
