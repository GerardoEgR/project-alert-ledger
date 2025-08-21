
import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from '@auth/application/services/auth.service';
import { CreateUserDto } from "@user/application/dto/create-user.dto";
import { LoginDto } from "@auth/application/dto/login.dto";

/**
 * It provides endpoints for user login and registration.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

}