/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */

// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import type { StrategyOptions } from 'passport-jwt';

// export interface JwtPayload {
//   userid: number;
//   useremail: string;
//   role: string;
// }

// export interface JwtUser {
//   userid: number;
//   useremail: string;
//   role: string;
// }

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
//   constructor() {
//     const options = {
//      
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: 'SECRET_KEY_123',
//     } as const;

//     // eslint-disable-next-line @typescript-eslint/no-unsafe-call
//     super(options as StrategyOptions);
//   }

//   validate(payload: JwtPayload): JwtUser {
//     return {
//       userid: payload.userid,
//       useremail: payload.useremail,
//       role: payload.role,
//     };
//   }
// }

import { PassportStrategy } from '@nestjs/passport';  
import { Strategy } from 'passport-local';  
import { Injectable, UnauthorizedException } from '@nestjs/common';  
import { AuthService } from './auth.service';  

@Injectable()  
export class LocalStrategy extends PassportStrategy(Strategy) {  
  constructor(private authService: AuthService) {  
    super({ usernameField: 'email' }); 
  }  
  async validate(email: string, password: string): Promise<any> {  
    const user = await this.authService.login({ email, password });
    console.log('Validating user in LocalStrategy:', user); 
    if (!user) {  
      console.log('Invalid credentials provided');
      throw new UnauthorizedException();  
    }  
    return user;  
  }  
}