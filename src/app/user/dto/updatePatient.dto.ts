import { IsOptional, IsString } from 'class-validator';
import { UpdateUserDto } from './updateUser.dto';
import { Trim } from 'src/common/decorators';

export class UpdatePatientDto extends UpdateUserDto {
  @IsOptional()
  @IsString()
  @Trim()
  address?: string;
}
