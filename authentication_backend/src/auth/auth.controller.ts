/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
// import { LoginAuthDto } from './dto/login-auth.dto';
import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  registerUser(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.createUser(createAuthDto);
  }

  // @Post('login')
  // loginUser(@Body() loginAuthDto: LoginAuthDto) {
  //   return this.authService.login(loginAuthDto);
  // }
  @UseGuards(AuthGuard('local'))  
  @Post('/login')
  loginUser(@Request() req: any): any {
    console.log('User:', req.user);
    req.session.user = req.user;
    return { message: 'Login successful' };
  }

  @Post('logout')
  logout(@Request() req): any {
    req.session.destroy();
    return { message: 'Logout successful' };
  }

  @UseGuards(AuthGuard('local')) 
  @Get()
  getWelcome() {
    return 'Welcome to the Auth Service';
  }
}