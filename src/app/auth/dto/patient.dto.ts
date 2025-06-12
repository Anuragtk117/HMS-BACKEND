import { IsNotEmpty, IsString } from 'class-validator';
import { AuthDto } from './auth.dto';
import { Trim } from 'src/common/decorators';

export class PatientDto extends AuthDto {
  @IsNotEmpty()
  @IsString()
  @Trim()
  address: string;
}
