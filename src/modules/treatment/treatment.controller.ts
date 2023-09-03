import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginationParamsDto } from 'src/dtos/pagination/pagination.dto';
import { AnyOfRole } from 'src/guards/role/role.decorator';
import { RolesGuard } from 'src/guards/role/role.guard';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { GetPatientByIdDto } from '../patient/dto/patient.dto';
import { TreatmentService } from './treatment.service';

@ApiTags('Treatment')
@ApiBearerAuth()
@Controller('treatment')
@UseGuards(JwtAuthGuard)
@Controller('treatment')
export class TreatmentController {
  constructor(private treatmentService: TreatmentService) {}

  @AnyOfRole(['admin', 'doctor'])
  @UseGuards(RolesGuard)
  @Get('/patientTreatments/:patientId')
  getPatientTreatments(
    @Param() dto: GetPatientByIdDto,
    @Query() pagination: PaginationParamsDto,
  ) {
    return this.treatmentService.getPatientTreatments(dto, pagination);
  }
}
