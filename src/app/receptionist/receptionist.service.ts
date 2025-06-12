import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppointmentDto } from './dto';

@Injectable()
export class ReceptionistService {
  constructor(private prisma: PrismaService) {}

  async scheduleAppointment(dto: AppointmentDto) {
    try {
      const doctorExist = await this.prisma.doctor.findUnique({
        where: { id: dto.doctorId },
      });

      if (!doctorExist) {
        throw new BadRequestException('Doctor not found');
      }

      const patientExist = await this.prisma.patient.findUnique({
        where: { id: dto.patientId },
      });

      if (!patientExist) {
        throw new BadRequestException('Patient not found');
      }

      await this.prisma.appointment.create({
        data: {
          patientId: dto.patientId,
          doctorId: dto.doctorId,
          appointmentDate: new Date(dto.appointmentDate),
        },
      });
      return { success: true, message: 'Appointment scheduled successfully' };
    } catch (error) {
      throw error;
    }
  }
}
