import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Trim } from 'src/common/decorators';

class MedicineItemDto {
  @IsNotEmpty()
  @IsNumber()
  pharmacyItemId: number;

  @IsNotEmpty()
  @IsString()
  dosage: string;

  @IsNotEmpty()
  @IsString()
  duration: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

export class PrescriptionDto {
  @IsNotEmpty()
  @IsNumber()
  patientId: number;

  @IsOptional()
  @IsString()
  @Trim()
  notes?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MedicineItemDto)
  medicines?: MedicineItemDto[];
}
