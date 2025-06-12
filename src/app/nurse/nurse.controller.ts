import { Controller } from '@nestjs/common';
import { NurseService } from './nurse.service';

@Controller('nurse')
export class NurseController {
  constructor(private nurseService: NurseService) {}
}
