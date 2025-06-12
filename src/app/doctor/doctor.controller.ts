import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { JwtAuthGuard, RolesGuard } from 'src/common/guards';
import { Roles } from 'src/common/decorators';
import { AppointmentStatus, Role } from 'src/common/enums';
import { PrescriptionDto } from './dto/prescription.dto';

@Controller('doctor')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.DOCTOR)
export class DoctorController {
  constructor(private doctorService: DoctorService) {}

  @Get('appointments')
  getAllAppointments(
    @Req() req,
    @Query('date') date?: string,
    @Query('page', ParseIntPipe) page?: number,
    @Query('limit', ParseIntPipe) limit?: number,
  ) {
    const userId = req.user.sub;
    if (!date) {
      const currentDate = new Date().toLocaleDateString();
      return this.doctorService.getAllAppointments(
        userId,
        currentDate,
        page,
        limit,
      );
    }
    return this.doctorService.getAllAppointments(userId, date, page, limit);
  }

  @Post('appointments/update-status')
  updateAppointmentStatus(
    @Param('id', ParseIntPipe) id: number,
    @Query('type', new ParseEnumPipe(AppointmentStatus))
    type: AppointmentStatus,
  ) {
    return this.doctorService.updateAppointmentStatus(id, type);
  }

  @Post('prescription')
  addPrescription(@Body() dto: PrescriptionDto, @Req() req) {
    return this.doctorService.addPrescription(dto, req.user.sub);
  }
}
