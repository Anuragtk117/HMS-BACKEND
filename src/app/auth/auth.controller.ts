import { Body, Controller, ParseEnumPipe, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, LoginDto } from './dto';
import { Role } from 'src/common/enums';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(
    @Body() dto: AuthDto,
    @Query('type', new ParseEnumPipe(Role)) type: Role,
  ) {
    return this.authService.register(dto, type);
  }

  @Post('register/patient')
  registerPatient(@Body() dto: AuthDto) {
    return this.authService.registerPatient(dto);
  }

  @Post('logIn')
  logIn(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
