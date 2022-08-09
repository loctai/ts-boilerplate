import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class ReqCreateUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public password: string;
}