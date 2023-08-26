import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { TreatmentService } from './treatment.service';

@ApiTags('Treatment')
@ApiBearerAuth()
@Controller('patient')
@UseGuards(JwtAuthGuard)
@Controller('treatment')
export class TreatmentController {
  constructor(private treatmentService: TreatmentService) {}
}
