import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Trim } from 'src/common/decorators';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  @Length(8 - 15)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  @Trim()
  currentPassword: string;

  @IsNotEmpty()
  @IsString()
  @Length(8 - 15)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  @Trim()
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  @Length(8 - 15)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  @Trim()
  confirmPassword: string;
}
