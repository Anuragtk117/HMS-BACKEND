import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ChangePasswordDto,
  UpdateDoctorDto,
  UpdatePatientDto,
  UpdateUserDto,
} from './dto';
import { compareData, hashData } from 'src/common/utils/crypto.util';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async updateUserDetails(dto: UpdateUserDto, id: number) {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          username: dto.username,
          email: dto.email,
          phone: dto.phone,
          fullName: dto.fullName,
          dob: dto.dob,
          bloodType: dto.bloodType,
        },
      });

      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }

      return {
        success: true,
        message: 'User updated successfully',
        user: updatedUser,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateDoctorDetails(dto: UpdateDoctorDto, id: number) {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const updatedUser = await prisma.user.update({
          where: { id },
          data: {
            username: dto.username,
            email: dto.email,
            phone: dto.phone,
            fullName: dto.fullName,
            dob: dto.dob,
            bloodType: dto.bloodType,
          },
        });

        if (!updatedUser) {
          throw new NotFoundException('User not found');
        }

        const updatedDoctor = await prisma.doctor.update({
          where: { userId: id },
          data: {
            departmentId: dto.departmentId,
            specialization: dto.specialization,
            licenseNumber: dto.licenseNumber,
          },
        });

        if (!updatedDoctor) {
          throw new NotFoundException('Doctor not found');
        }

        return {
          success: true,
          message: 'User updated successfully',
          user: { ...updatedUser, updatedDoctor },
        };
      });
    } catch (error) {
      throw error;
    }
  }

  async updatePatientDetails(dto: UpdatePatientDto, id: number) {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const updatedUser = await prisma.user.update({
          where: { id },
          data: {
            username: dto.username,
            email: dto.email,
            phone: dto.phone,
            fullName: dto.fullName,
            dob: dto.dob,
            bloodType: dto.bloodType,
          },
        });

        if (!updatedUser) {
          throw new NotFoundException('User not found');
        }
        const updatedPatient = await prisma.patient.update({
          where: { userId: id },
          data: { address: dto.address },
        });

        if (!updatedPatient) {
          throw new NotFoundException('Patient not found');
        }

        return {
          success: true,
          message: 'User updated successfully',
          user: { ...updatedUser, updatedPatient },
        };
      });
    } catch (error) {
      throw error;
    }
  }

  async getUserDetails(id: number) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      const doctor = await this.prisma.doctor.findUnique({
        where: { userId: id },
      });
      const patient = await this.prisma.patient.findUnique({
        where: { userId: id },
      });
      return {
        success: true,
        message: 'User details fetched successfully',
        userDetails: { ...user, doctor, patient },
      };
    } catch (error) {
      throw error;
    }
  }

  async changePassword(dto: ChangePasswordDto, id: number) {
    try {
      if (dto.newPassword !== dto.confirmPassword) {
        throw new BadRequestException(
          'New password and confirm password do not match',
        );
      }

      const user = await this.prisma.user.findUnique({ where: { id } });
      const verifyPassword = await compareData(
        dto.currentPassword,
        user!.password,
      );

      if (!verifyPassword) {
        throw new BadRequestException('Current password is incorrect');
      }

      const hashedPassword = await hashData(dto.newPassword);

      await this.prisma.user.update({
        where: { id },
        data: { password: hashedPassword },
      });

      return { success: true, message: 'Password changed successfully' };
    } catch (error) {
      throw error;
    }
  }
}
