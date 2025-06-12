import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from 'src/app/prisma/prisma.service';
import { AuthDto, DoctorDto, LoginDto, PatientDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Role } from '@prisma/client';
import { compareData, hashData } from 'src/common/utils/crypto.util';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private configService: ConfigService,
  ) {}

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
      return await this.prisma.$transaction(async (prisma) => {
        const hashedPassword: string = await hashData(dto.password);
        const user = await prisma.user.create({
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

        const departmentExist = await prisma.department.findUnique({
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
      });
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

  async registerPatient(dto: PatientDto) {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const hashedPassword: string = await hashData(dto.password);
        const user = await prisma.user.create({
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

        const patient = await prisma.patient.create({
          data: {
            userId: user.id,
            address: dto.address,
          },
        });
        const { password, ...userWithoutPassword } = user;
        const userData = { ...userWithoutPassword, patient };
        return {
          success: true,
          message: 'Patient registered successfully',
          user: userData,
        };
      });
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
        throw new UnauthorizedException('Invalid username or password');
      }

      const isPasswordValid: boolean = await compareData(
        dto.password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid username or password');
      }

      const sessionId = uuidv4();

      const payload = {
        sub: user.id,
        email: user.email,
        sessionId,
        role: user.role,
      };

      const accessToken = this.jwt.sign(payload);

      const refreshToken = this.jwt.sign(payload, {
        expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN'),
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      });

      const hashedRefreshToken = await hashData(refreshToken);
      await this.prisma.loginSessions.create({
        data: {
          userId: user.id,
          refreshToken: hashedRefreshToken,
          sessionId: sessionId,
        },
      });

      return {
        success: true,
        message: 'Login successfull',
        payload: { accessToken, refreshToken },
      };
    } catch (error) {
      throw error;
    }
  }

  async logout(userId: number, sessionId: string) {
    try {
      await this.prisma.loginSessions.update({
        where: {
          sessionId,
          userId,
        },
        data: {
          logoutTime: new Date(),
          isActive: false,
        },
      });
      return { success: true, message: 'Logout successfull' };
    } catch (error) {
      throw error;
    }
  }

  async logoutAll(userId: number) {
    try {
      await this.prisma.loginSessions.updateMany({
        where: {
          userId,
        },
        data: {
          logoutTime: new Date(),
          isActive: false,
        },
      });
      return { success: true, message: 'Logged out from all sessions' };
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(payload: any) {
    try {
      const session = await this.prisma.loginSessions.findUnique({
        where: {
          sessionId: payload.sessionId,
          userId: payload.sub,
          isActive: true,
        },
      });
      if (!session) {
        throw new ForbiddenException('Invalid token');
      }

      const validToken: boolean = await compareData(
        payload.refreshToken,
        session.refreshToken,
      );
      if (!validToken) {
        throw new ForbiddenException('Invalid token');
      }

      const newPayload = {
        sub: payload.sub,
        sessionId: payload.sessionId,
        role: payload.role,
      };
      const newAuthToken: string = this.jwt.sign(newPayload);
      return {
        success: true,
        message: 'Auth token refreshed successfully',
        newAuthToken,
      };
    } catch (error) {
      throw error;
    }
  }
}
