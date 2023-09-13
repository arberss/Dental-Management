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
import { GetUser } from '../auth/decorator/getUser.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { UserMeDto } from '../user/dto/user.dto';
import {
  CreatePatientWithTreatmentDto,
  DeletePatientDto,
  GetPatientByIdDto,
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
    @Query() filters: GetPatientQueryDto,
    @Query() pagination: PaginationParamsDto,
  ) {
    return this.patientService.getPatients(filters, pagination);
  }

  @AnyOfRole(['admin', 'doctor'])
  @UseGuards(RolesGuard)
  @Get('/stats')
  getPatientsStats(@GetUser() user: UserMeDto) {
    return this.patientService.getPatientsStats(user);
  }

  @AnyOfRole(['admin', 'doctor'])
  @UseGuards(RolesGuard)
  @Get(':patientId')
  getPatient(@Param() dto: GetPatientByIdDto) {
    return this.patientService.getPatient(dto.patientId);
  }
}
