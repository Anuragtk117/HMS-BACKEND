import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { DepartmentDto } from './dto';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('departments')
  addDepartment(@Body() dto: DepartmentDto) {
    return this.adminService.addDepartment(dto);
  }

  @Get('department/:id')
  getDepartmentById(@Param() id: number) {
    return this.adminService.getDepartmentById(id);
  }
}
