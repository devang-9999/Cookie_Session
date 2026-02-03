/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAuthDto {

    @IsString({ message: 'Username must be a string' })
    @IsNotEmpty({ message: 'Username cannot be empty' })
    username: string;

    @IsString({ message: 'Email must be a string' })
    @IsNotEmpty({ message: 'Email cannot be empty' })
    useremail: string;

    @IsString({ message: 'Password must be a string' })
    @IsNotEmpty({ message: 'Password cannot be empty' })
    userPassword: string;

}