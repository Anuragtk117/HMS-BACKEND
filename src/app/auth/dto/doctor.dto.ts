import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { AuthDto } from './auth.dto';
import { Trim } from 'src/common/decorators';

export class DoctorDto extends AuthDto {
  @IsNotEmpty()
  @IsNumber()
  departmentId: number;

  @IsNotEmpty()
  @IsString()
  @Trim()
  specialization: string;

  @IsNotEmpty()
  @IsString()
  @Trim()
  licenseNumber: string;
}
