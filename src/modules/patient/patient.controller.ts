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
import {
  DeleteTreatmentDto,
  UpdateTreatmentDto,
} from '../treatment/dto/treatment.dto';
import {
  CreatePatientWithTreatmentDto,
  DeletePatientDto,
  GetPatientQueryDto,
  UpdatePatientDto,
} from './dto/patient.dto';
import { PatientService } from './patient.service';

@ApiTags('Patient')
@ApiBearerAuth()
@Controller('patient')
@UseGuards(JwtAuthGuard)
export class PatientController {
  constructor(private patientService: PatientService) {}

  @AnyOfRole(['admin', 'doctor'])
  @UseGuards(RolesGuard)
  @Put('/addPatientTreatment')
  addPatientTreatment(@Body() dto: CreatePatientWithTreatmentDto) {
    return this.patientService.addPatientTreatment(dto);
  }

  @AnyOfRole(['admin', 'doctor'])
  @UseGuards(RolesGuard)
  @Put('/updatePatientTreatment')
  updatePatientTreatment(@Body() dto: UpdateTreatmentDto) {
    return this.patientService.updateTreatment(dto);
  }

  @AnyOfRole(['admin', 'doctor'])
  @UseGuards(RolesGuard)
  @Delete('/deletePatientTreatment/:treatmentId')
  deletePatientTreatment(@Param() dto: DeleteTreatmentDto) {
    return this.patientService.deleteTreatment(dto);
  }

  @AnyOfRole(['admin', 'doctor'])
  @UseGuards(RolesGuard)
  @Delete('/deletePatient/:patientId')
  deletePatient(@Param() dto: DeletePatientDto) {
    return this.patientService.deletePatient(dto);
  }

  @AnyOfRole(['admin', 'doctor'])
  @UseGuards(RolesGuard)
  @Put('/updatePatient')
  updatePatient(@Body() dto: UpdatePatientDto) {
    return this.patientService.updatePatient(dto);
  }

  @AnyOfRole(['admin', 'doctor'])
  @UseGuards(RolesGuard)
  @Get('/patients')
  getPatients(
    @Query() dto: GetPatientQueryDto,
    @Query() pagination: PaginationParamsDto,
  ) {
    return this.patientService.getPatients(dto, pagination);
  }
}
