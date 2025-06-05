import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { AuthDto } from "./auth.dto";

export class DoctorDto extends AuthDto{
    @IsNotEmpty()
    @IsNumber()
    departmentId:number

    @IsNotEmpty()
    @IsString()
    specialization:string

    @IsNotEmpty()
    @IsString()
    licenseNumber:string
}