import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ReceptionistService } from './receptionist.service';
import { AppointmentDto } from './dto';
import { JwtAuthGuard, RolesGuard } from 'src/common/guards';
import { Roles } from 'src/common/decorators';
import { Role } from 'src/common/enums';

@Controller('receptionist')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.RECEPTIONIST)
export class ReceptionistController {
  constructor(private receptionistService: ReceptionistService) {}

  @Post('schedule-appointment')
  scheduleAppointment(@Body() dto: AppointmentDto) {
    return this.receptionistService.scheduleAppointment(dto);
  }
}
