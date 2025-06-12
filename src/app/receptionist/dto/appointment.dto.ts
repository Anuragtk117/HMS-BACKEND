import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class AppointmentDto {
  @IsNotEmpty()
  @IsNumber()
  patientId: number;

  @IsNotEmpty()
  @IsNumber()
  doctorId: number;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  appointmentDate: Date;
}
