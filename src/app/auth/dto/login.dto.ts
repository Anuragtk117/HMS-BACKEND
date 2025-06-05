import { IsNotEmpty, IsString, Length } from "class-validator";

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  identifier: string; 

  @IsNotEmpty()
  @Length(8, 15)
  password: string;
}