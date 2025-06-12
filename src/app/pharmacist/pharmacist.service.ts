import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PharmacistService {
  constructor(private prisma: PrismaService) {}
}
