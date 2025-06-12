import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppointmentStatus } from 'src/common/enums';
import { PrescriptionDto } from './dto/prescription.dto';

@Injectable()
export class DoctorService {
  constructor(private prisma: PrismaService) {}

  async getAllAppointments(
    userId: number,
    date: string,
    page?: number,
    limit?: number,
  ) {
    try {
      const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
      if (!doctor) {
        throw new NotFoundException('Doctor not found');
      }

      const currentPage = page || 1;
      const pageSize = limit || 20;
      const skip = (currentPage - 1) * pageSize;

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const [appointments, totalAppointments] = await Promise.all([
        this.prisma.appointment.findMany({
          where: {
            doctorId: doctor.id,
            appointmentDate: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
          include: { patient: { include: { user: true } } },
          take: pageSize,
          skip,
          orderBy: { createdAt: 'asc' },
        }),

        this.prisma.appointment.count({
          where: {
            doctorId: doctor.id,
            appointmentDate: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        }),
      ]);

      return {
        success: true,
        message: 'Appointment list fetched successfully',
        pagination: {
          totalAppointments,
          currentPage,
          totalpages: Math.ceil(totalAppointments / pageSize),
          limit,
        },
        appointments,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateAppointmentStatus(id: number, type: AppointmentStatus) {
    try {
      const appointment = await this.prisma.appointment.update({
        where: { id },
        data: {
          status: type,
        },
      });
      return {
        success: true,
        message: 'Appointment status updated successfully',
        appointment,
      };
    } catch (error) {
      throw error;
    }
  }

  async addPrescription(dto: PrescriptionDto, doctorId: number) {
    try {
      const { patientId, notes, medicines } = dto;

      const patientExist = await this.prisma.patient.findUnique({
        where: { id: patientId },
      });

      if (!patientExist) {
        throw new NotFoundException('Patient not found');
      }

      const prescription = await this.prisma.prescription.create({
        data: {
          patientId: patientId,
          doctorId,
          notes,
        },
      });

      if (medicines && medicines.length > 0) {
        const prescriptionItems = medicines.map((item) => ({
          ...item,
          prescriptionId: prescription.id,
        }));

        await this.prisma.prescriptionItem.createMany({
          data: prescriptionItems,
        });
      }
      return { success: true, message: 'Prescription added successfuly' };
    } catch (error) {
      throw error;
    }
  }
}
