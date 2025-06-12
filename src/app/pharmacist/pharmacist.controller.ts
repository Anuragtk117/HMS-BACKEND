import { Controller } from '@nestjs/common';
import { PharmacistService } from './pharmacist.service';

@Controller('pharmacist')
export class PharmacistController {
  constructor(private pharmacistService: PharmacistService) {}
}
