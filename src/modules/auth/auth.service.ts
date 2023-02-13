import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateCredentialDto, AuthCredentialsDto } from 'src/modules/auth/dto/credentials.dto';
import { UserResDto } from 'src/modules/user/dto/user-res.dto';
import { UserService } from 'src/modules/user/user.service';
import { UserRoleEnum } from 'src/roles/roles.enum';
import { HttpRequestContextService } from 'src/shared/http-request-context/http-request-context.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly httpContext: HttpRequestContextService,
    private jwtService: JwtService,
    private usersService: UserService
  ) {}

  async getCurrentUser(): Promise<UserResDto> {
    const userId = this.httpContext.getUser().id;
    const user = await this.usersService.findOne({ id: userId });
    if (!user.isActive) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          errors: {
            password: 'inactivated account',
          },
        },
        HttpStatus.FORBIDDEN
      );
    }

    const { id, email, fullName, roles } = user;

    const dto: UserResDto = {
      id,
      email,
      fullName,
      roles,
    };

    return dto;
  }

  async validateLogin(loginDto: AuthCredentialsDto): Promise<{ token: string }> {
    const user = await this.usersService.findOne({
      email: loginDto.email,
    });
    const isValidPassword = await bcrypt.compare(loginDto.password, user.password);

    if (isValidPassword) {
      const token = await this.jwtService.sign({
        id: user.id,
        email: user.email,
        roles: user.roles,
      });

      return { token };
    } else {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            password: 'incorrectPassword',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }
  }

  async register(userDto: CreateCredentialDto): Promise<void> {
    const { email, password, fullName } = userDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    await this.usersService.create({
      email,
      password: hashedPassword,
      fullName,
      roles: [UserRoleEnum.USER],
    });

    // TODO: Do mailing stuffs
    // await this.mailService.userSignUp({
    //   to: user.email,
    //   data: {
    //     hash,
    //   },
    // });
  }
}
