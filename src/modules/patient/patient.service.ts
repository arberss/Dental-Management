import {
  CreatePatientWithTreatmentDto,
  DeletePatientDto,
  GetPatientQueryDto,
  UpdatePatientDto,
} from './dto/patient.dto';
import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { Patient, PatientDocument } from 'src/schema/patient.schema';
import { TreatmentService } from '../treatment/treatment.service';
import {
  DeleteTreatmentDto,
  UpdateTreatmentDto,
} from '../treatment/dto/treatment.dto';
import { Treatment, TreatmentDocument } from 'src/schema/treatment.schema';
import { PaginationParamsDto } from 'src/dtos/pagination/pagination.dto';
import { formatResponse, paginationParams } from 'src/dtos/pagination/config';

@Injectable()
export class PatientService {
  @Inject(TreatmentService)
  private readonly treatmentService: TreatmentService;

  constructor(
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
    @InjectModel(Patient.name)
    private patientModelPag: PaginateModel<PatientDocument>,

    @InjectModel(Treatment.name)
    private treatmentModel: Model<TreatmentDocument>,
  ) {}

  async addPatientTreatment(dto: CreatePatientWithTreatmentDto) {
    try {
      const checkPatient = await this.patientModel.findOne({
        firstName: dto.firstName,
        lastName: dto.lastName,
        parentName: dto.parentName,
        dateOfBirth: dto.dateOfBirth,
        ...(dto.contactNumber && { contactNumber: dto.contactNumber }),
      });

      const treatment = await this.treatmentService.createTreatment(
        dto.treatment,
      );

      if (treatment) {
        const dataToSet = {
          firstName: dto.firstName,
          parentName: dto.parentName,
          lastName: dto.lastName,
          dateOfBirth: dto.dateOfBirth,
          contactNumber: dto?.contactNumber ?? null,
          address: dto.address,
        };

        if (checkPatient) {
          const updatedPatientTreatment =
            await this.patientModel.findOneAndUpdate(
              {
                firstName: dto.firstName,
                lastName: dto.lastName,
                parentName: dto.parentName,
                dateOfBirth: dto.dateOfBirth,
                ...(dto.contactNumber && { contactNumber: dto.contactNumber }),
              },
              {
                $push: {
                  treatments: treatment._id,
                },
              },
              {
                new: true,
              },
            );
          return updatedPatientTreatment;
        } else {
          const createdPatientWithTreatment = await this.patientModel.create({
            ...dataToSet,
            treatments: [treatment._id],
          });

          return createdPatientWithTreatment;
        }
      } else {
        throw new ForbiddenException('Something went wrong');
      }
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async updateTreatment(dto: UpdateTreatmentDto) {
    try {
      const updatedTreatment = await this.treatmentService.updateTreatment(dto);
      return updatedTreatment;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async deleteTreatment(dto: DeleteTreatmentDto) {
    try {
      const deletedTreatment = await this.treatmentService.deleteTreatment(dto);
      return deletedTreatment;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async updatePatient(dto: UpdatePatientDto) {
    try {
      const patient = await this.patientModel.findByIdAndUpdate(
        dto.id,
        {
          firstName: dto.firstName,
          lastName: dto.lastName,
          parentName: dto.parentName,
          dateOfBirth: dto.dateOfBirth,
          ...(dto?.contactNumber && { contactNumber: dto.contactNumber }),
          address: dto.address,
        },
        { new: true },
      );

      return patient;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async deletePatient(dto: DeletePatientDto) {
    try {
      const patient = await this.patientModel.findById(dto.patientId);

      if (!patient) {
        throw new NotFoundException("Patient doesn't exist!");
      }

      // delete patient
      const deletedPatient = await patient.deleteOne();

      // if patient is deleted, delete all treatments
      if (deletedPatient?._id) {
        const patientTreatmentsIds = deletedPatient.treatments.map((p) => {
          return this.treatmentModel.findByIdAndDelete(p._id);
        });
        Promise.all(patientTreatmentsIds);
        return dto.patientId;
      }

      throw new ForbiddenException('Something went wrong');
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async getPatients(dto: GetPatientQueryDto, pagination: PaginationParamsDto) {
    try {
      const patients = await this.patientModelPag.paginate(
        {
          firstName: { $regex: dto?.firstName ?? '', $options: 'i' },
          parentName: { $regex: dto?.parentName ?? '', $options: 'i' },
          lastName: { $regex: dto?.lastName ?? '', $options: 'i' },
          contactNumber: {
            $regex: dto?.contactNumber ?? '',
            $options: 'i',
          },
        },
        paginationParams(pagination),
      );

      return formatResponse(patients);
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
