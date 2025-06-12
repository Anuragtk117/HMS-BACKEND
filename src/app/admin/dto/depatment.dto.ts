import { IsNotEmpty, IsString } from 'class-validator';
import { Trim } from 'src/common/decorators';

export class DepartmentDto {
  @IsNotEmpty()
  @IsString()
  @Trim()
  name: string;
}
