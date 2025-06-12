import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Trim } from 'src/common/decorators';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @Trim()
  username?: string;

  @IsEmail()
  @IsOptional()
  @Trim()
  email?: string;

  @IsOptional()
  @Matches(
    /^(?:\+91|91)?\s?[6789]\d{9}$|^(?:\+91|91)?\s?(?:[1-9]\d{1,3}[-.\s]?\d{6,8})$/,
    {
      message: 'Phone number must be a valid mobile or landline number',
    },
  )
  @Trim()
  phone?: string;

  @IsOptional()
  @IsString()
  @Trim()
  fullName?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dob?: Date;

  @IsString()
  @IsOptional()
  @Trim()
  bloodType?: string;
}
