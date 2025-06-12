import { IsNumber, IsOptional, IsString } from 'class-validator';
import { UpdateUserDto } from './updateUser.dto';
import { Trim } from 'src/common/decorators';

export class UpdateDoctorDto extends UpdateUserDto {
  @IsOptional()
  @IsNumber()
  departmentId?: number;

  @IsOptional()
  @IsString()
  @Trim()
  specialization?: string;

  @IsOptional()
  @IsString()
  @Trim()
  licenseNumber?: string;
}
