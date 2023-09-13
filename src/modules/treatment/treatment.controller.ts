import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginationParamsDto } from 'src/dtos/pagination/pagination.dto';
import { AnyOfRole } from 'src/guards/role/role.decorator';
import { RolesGuard } from 'src/guards/role/role.guard';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { GetPatientByIdDto } from '../patient/dto/patient.dto';
import {
  DeleteTreatmentDto,
  GetTreatmentQueryDto,
  UpdateTreatmentDto,
} from './dto/treatment.dto';
import { TreatmentService } from './treatment.service';

@ApiTags('Treatment')
@ApiBearerAuth()
@Controller('treatments')
@UseGuards(JwtAuthGuard)
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

  @AnyOfRole(['admin', 'doctor'])
  @UseGuards(RolesGuard)
  @Get('/')
  getTreatments(
    @Query() filters: GetTreatmentQueryDto,
    @Query() pagination: PaginationParamsDto,
  ) {
    return this.treatmentService.getTreatments(filters, pagination);
  }

  @AnyOfRole(['admin', 'doctor'])
  @UseGuards(RolesGuard)
  @Put('/updateTreatment')
  updatePatientTreatment(@Body() dto: UpdateTreatmentDto) {
    return this.treatmentService.updateTreatment(dto);
  }

  @AnyOfRole(['admin', 'doctor'])
  @UseGuards(RolesGuard)
  @Delete('/deleteTreatment/:treatmentId')
  deleteTreatment(@Param() dto: DeleteTreatmentDto) {
    return this.treatmentService.deleteTreatment(dto);
  }
}
