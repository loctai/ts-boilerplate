import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class ReqLoginUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public password: string;
}