import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DepartmentDto } from './dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async addDepartment(dto: DepartmentDto) {
    try {
      const department = await this.prisma.department.create({
        data: {
          name: dto.name,
        },
      });
      return {
        success: true,
        message: 'Department added successfully',
        department,
      };
    } catch (error) {
      throw error;
    }
  }

  async getDepartmentById(id: number) {
    try {
      const department = await this.prisma.department.findUnique({
        where: { id },
      });
      if (!department) {
        throw new NotFoundException('Department not found');
      }
      return {
        success: true,
        message: 'Department details fetched successfully',
        department,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateDepartment(dto: DepartmentDto, id: number) {
    try {
      const department = await this.prisma.department.update({
        data: {
          name: dto.name,
        },
        where: {
          id,
        },
      });
      if (!department) {
        throw new NotFoundException('Department not found');
      }

      return {
        success: true,
        message: 'Department updated successfully',
        department,
      };
    } catch (error) {
      throw error;
    }
  }
}
