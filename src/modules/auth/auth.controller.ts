import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/decorators/http.decorators';
import { AuthService } from 'src/modules/auth/auth.service';
import { AuthCredentialsDto, CreateCredentialDto } from 'src/modules/auth/dto/credentials.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-in')
  signIn(@Body() authCredentialsDto: AuthCredentialsDto) {
    return this.authService.validateLogin(authCredentialsDto);
  }

  @Post('/sign-up')
  signUp(@Body() createAuthDto: CreateCredentialDto) {
    return this.authService.register(createAuthDto);
  }

  @Auth()
  @Get('/me')
  getCurrentUser() {
    return this.authService.getCurrentUser();
  }
}
