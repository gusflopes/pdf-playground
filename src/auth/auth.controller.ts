import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  create(@Body() createUserDto: SignupDto) {
    console.log(createUserDto);
    console.log('Controller');
    return this.authService.register(createUserDto);
  }

  @Post('/login')
  signIn(@Body() payload: SigninDto) {
    console.log(payload);
    return this.authService.login(payload);
  }
}
