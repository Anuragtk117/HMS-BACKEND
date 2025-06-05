import { Type } from "class-transformer";
import { IsDate, IsEmail, IsNotEmpty,IsOptional,IsString,Length, Matches } from "class-validator";

export class AuthDto{
    @IsString()
    @IsNotEmpty()
    username:string;

    @IsEmail()
    @IsOptional()
    email :string;

     @IsNotEmpty()
     @Matches(/^(?:\+91|91)?\s?[6789]\d{9}$|^(?:\+91|91)?\s?(?:[1-9]\d{1,3}[-.\s]?\d{6,8})$/, {
        message: 'Phone number must be a valid mobile or landline number',
    })
    phone: string;

    @IsNotEmpty()
    @Length(8, 15)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/, {
        message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    })
    password: string;

    @IsNotEmpty()
    @IsString()
    fullName:string;

    @IsNotEmpty()
    @Type(()=>Date)
    @IsDate()
    dob:Date;
    
    @IsString()
    @IsOptional()
    bloodType:string;
}