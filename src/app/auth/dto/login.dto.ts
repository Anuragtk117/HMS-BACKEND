import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Trim } from 'src/common/decorators';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @Trim()
  identifier: string;

  @IsNotEmpty()
  @Length(8, 15)
  @Trim()
  password: string;
}
