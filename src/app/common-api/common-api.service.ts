import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommonApiService {
  constructor(private prisma: PrismaService) {}

  async getAllDepartments() {
    try {
      const departments = await this.prisma.department.findMany();
      if (!departments || departments.length === 0) {
        throw new NotFoundException('No departments found');
      }

      return {
        success: true,
        message: 'Departments fetched successfully',
        departments,
      };
    } catch (error) {
      throw error;
    }
  }
}
