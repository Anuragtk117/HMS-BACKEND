import {
  Body,
  Controller,
  ParseEnumPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, DoctorDto, LoginDto, PatientDto } from './dto';
import { Role } from 'src/common/enums';
import { JwtAuthGuard, RefreshTokenGuard, RolesGuard } from 'src/common/guards';
import { Roles } from 'src/common/decorators';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('register')
  register(
    @Body() dto: AuthDto,
    @Query('type', new ParseEnumPipe(Role)) type: Role,
  ) {
    return this.authService.register(dto, type);
  }

  @Post('register/patient')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.RECEPTIONIST)
  registerPatient(@Body() dto: PatientDto) {
    return this.authService.registerPatient(dto);
  }

  @Post('register/doctor')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  registerDoctor(@Body() dto: DoctorDto) {
    return this.authService.registerDoctor(dto);
  }

  @Post('logIn')
  logIn(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('logOut')
  @UseGuards(JwtAuthGuard)
  logOut(@Req() req) {
    return this.authService.logout(req.user.sub, req.user.sessionId);
  }

  @Post('logOut-all')
  @UseGuards(JwtAuthGuard)
  logoutAll(@Req() req) {
    return this.authService.logoutAll(req.user.sub);
  }

  @Post('refresh-token')
  @UseGuards(RefreshTokenGuard)
  refreshToken(@Req() req) {
    return this.authService.refreshToken(req.user);
  }
}
