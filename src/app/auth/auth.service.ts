import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/app/prisma/prisma.service';
import { AuthDto, DoctorDto, LoginDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Role } from '@prisma/client';
import { compareData, hashData } from 'src/common/utils/crypto.util';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(dto: AuthDto, type: Role) {
    try {
      const hashedPassword: string = await hashData(dto.password);
      const user = await this.prisma.user.create({
        data: {
          username: dto.username,
          email: dto.email,
          phone: dto.phone,
          fullName: dto.fullName,
          password: hashedPassword,
          role: type,
          dob: dto.dob,
          bloodType: dto.bloodType,
        },
      });

      const { password, ...userWithoutPassword } = user;

      return {
        success: true,
        message: 'User registered successfully',
        user: userWithoutPassword,
      };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('Email already exists');
      }
      throw error;
    }
  }

  async registerDoctor(dto: DoctorDto) {
    try {
      const hashedPassword: string = await hashData(dto.password);
      const user = await this.prisma.user.create({
        data: {
          username: dto.username,
          email: dto.email,
          phone: dto.phone,
          fullName: dto.fullName,
          password: hashedPassword,
          role: 'DOCTOR',
          dob: dto.dob,
          bloodType: dto.bloodType,
        },
      });

      const departmentExist = await this.prisma.department.findUnique({
        where: {
          id: dto.departmentId,
        },
      });

      if (!departmentExist) {
        throw new NotFoundException('Department not found');
      }

      const doctor = await this.prisma.doctor.create({
        data: {
          userId: user.id,
          departmentId: dto.departmentId,
          specialization: dto.specialization,
          licenseNumber: dto.licenseNumber,
        },
      });

      const { password, ...userWithoutPassword } = user;
      const userData = { ...userWithoutPassword, doctor };

      return {
        success: true,
        message: 'User registered successfully',
        user: userData,
      };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('Email already exists');
      }
      throw error;
    }
  }

  async registerPatient(dto: AuthDto) {
    try {
      const hashedPassword: string = await hashData(dto.password);
      const user = await this.prisma.user.create({
        data: {
          username: dto.username,
          email: dto.email,
          phone: dto.phone,
          fullName: dto.fullName,
          password: hashedPassword,
          role: 'PATIENT',
          dob: dto.dob,
          bloodType: dto.bloodType,
        },
      });
      const { password, ...userWithoutPassword } = user;
      return {
        success: true,
        message: 'Patient registered successfully',
        user: userWithoutPassword,
      };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('Email already exists');
      }
      throw error;
    }
  }

  async login(dto: LoginDto) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          OR: [{ email: dto.identifier }, { username: dto.identifier }],
        },
      });

      if (!user) {
        throw new BadRequestException('Invalid username or password');
      }

      const isPasswordValid: boolean = await compareData(
        dto.password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new BadRequestException('Invalid username or password');
      }
    } catch (error) {
      throw error;
    }
  }
}
