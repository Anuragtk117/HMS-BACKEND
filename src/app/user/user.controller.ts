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
import { UserService } from './user.service';
import {
  ChangePasswordDto,
  UpdateDoctorDto,
  UpdatePatientDto,
  UpdateUserDto,
} from './dto';
import { JwtAuthGuard, RolesGuard } from 'src/common/guards';
import { Roles } from 'src/common/decorators';
import { Role } from 'src/common/enums';

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Post('update/user/:id')
  updateUserDetails(
    @Body() dto: UpdateUserDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.userService.updateUserDetails(dto, id);
  }

  @Post('update/doctor/:id')
  @Roles(Role.ADMIN, Role.DOCTOR)
  updateDoctorDetails(
    @Body() dto: UpdateDoctorDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.userService.updateDoctorDetails(dto, id);
  }

  @Post('update/patient/:id')
  @Roles(Role.ADMIN, Role.PATIENT, Role.RECEPTIONIST)
  updatePatientDetails(
    @Body() dto: UpdatePatientDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.userService.updatePatientDetails(dto, id);
  }

  @Get('details')
  getUserDetails(@Req() req) {
    return this.userService.getUserDetails(req.user.sub);
  }

  @Post('change-password')
  changePassword(@Body() dto: ChangePasswordDto, @Req() req) {
    return this.userService.changePassword(dto, req.user.sub);
  }
}
