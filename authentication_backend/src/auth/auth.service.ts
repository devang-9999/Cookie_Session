/* eslint-disable prettier/prettier */
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Auth } from './entities/auth.entity';
// import { LoginAuthDto } from './dto/login-auth.dto';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private userRepository: Repository<Auth>,
    private jwtService: JwtService,
  ) { }

  async toggleBlockUser(userId: number) {
    const user = await this.userRepository.findOne({
      where: { userid: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.userRepository.save(user);
  }

  async getAllUsers() {
    return this.userRepository.find({
      select: ['userid', 'username', 'useremail'],
    });
  }


  async createUser(createAuthDto: CreateAuthDto) {
    const { username, useremail, userPassword } = createAuthDto;

    const existingUser = await this.userRepository.findOne({
      where: [{ useremail }],
    });

    if (existingUser) {
      throw new HttpException({ message: 'User already exists' }, 400);
    }

    const newUser = this.userRepository.create({
      username,
      useremail,
      userPassword,
    });

    return this.userRepository.save(newUser);
  }

   async validateUser(email: string, password: string) {
    return this.userRepository.findOne({
      where: { useremail: email, userPassword: password },
    });
  }

  generateToken(user: Auth) {
    return this.jwtService.sign({
      userid: user.userid,
      email: user.useremail,
    });
  }

  // async login(loginAuthDto: LoginAuthDto) {
  //   const { email, password } = loginAuthDto;


  //   const user = await this.userRepository.findOne({
  //     where: {
  //       useremail: email,
  //       userPassword: password,
  //     },
  //   });

  //   if (!user) {
  //     throw new HttpException({ message: 'Invalid credentials' }, 401);
  //   }

  //   const payload = {
  //     userid: user.userid,
  //     useremail: user.useremail,
  //   };

  //   return {
  //     access_token: this.jwtService.sign(payload),
  //     user: {
  //       userid: user.userid,
  //       email: user.useremail,
  //     },
  //   };
  // }
}

