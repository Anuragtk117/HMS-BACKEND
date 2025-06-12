import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { DepartmentDto } from './dto';
import { Roles } from 'src/common/decorators';
import { Role } from 'src/common/enums';
import { JwtAuthGuard, RolesGuard } from 'src/common/guards';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('departments')
  addDepartment(@Body() dto: DepartmentDto) {
    return this.adminService.addDepartment(dto);
  }

  @Get('departments/:id')
  getDepartmentById(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getDepartmentById(id);
  }

  @Post('departments/:id')
  updateDepartment(
    @Body() dto: DepartmentDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.adminService.updateDepartment(dto, id);
  }
}
