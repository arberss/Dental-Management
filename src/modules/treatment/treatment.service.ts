import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { formatResponse } from 'src/dtos/pagination/config';
import { PaginationParamsDto } from 'src/dtos/pagination/pagination.dto';
import { Patient, PatientDocument } from 'src/schema/patient.schema';
import { Treatment, TreatmentDocument } from 'src/schema/treatment.schema';
import { calculatePages, skipPages } from 'src/utils';
import { GetPatientByIdDto } from '../patient/dto/patient.dto';
import {
  CreateTreatmentDto,
  DeleteTreatmentDto,
  GetTreatmentQueryDto,
  UpdateTreatmentDto,
} from './dto/treatment.dto';
import * as mongoose from 'mongoose';

@Injectable()
export class TreatmentService {
  constructor(
    @InjectModel(Treatment.name)
    private treatmentModel: Model<TreatmentDocument>,
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
  ) {}

  async createTreatment(dto: CreateTreatmentDto) {
    try {
      const treatment = await this.treatmentModel.create({
        name: dto.name,
        description: dto.description,
        price: dto.price,
        doctor: dto.doctor,
      });

      return treatment;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async updateTreatment(dto: UpdateTreatmentDto) {
    try {
      const treatment = await this.treatmentModel.findById(dto._id);

      if (!treatment) {
        throw new NotFoundException('This treatment does not exist!');
      }

      treatment.name = dto.name;
      if (dto?.description) {
        treatment.description = dto.description;
      }
      treatment.price = dto.price;
      treatment.doctor = dto.doctor;

      const updatedTreatment = await treatment.save();
      return updatedTreatment;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async getPatientTreatments(
    dto: GetPatientByIdDto,
    pagination: PaginationParamsDto,
  ) {
    try {
      const patient = await this.patientModel.findById(dto.patientId);
      if (!patient) {
        throw new NotFoundException('Patient not found');
      }

      const treatmentIds = patient.treatments; // Assuming treatments array holds treatment IDs
      const treatments = await this.treatmentModel
        .find({ _id: { $in: treatmentIds } })
        .sort('-_id')
        .populate({
          path: 'doctor',
          select: '_id firstName lastName',
        })
        .skip(skipPages(pagination))
        .limit(Number(pagination.size));

      return treatments;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async getTreatments(
    filters: GetTreatmentQueryDto,
    pagination: PaginationParamsDto,
  ) {
    try {
      const treatments = await this.treatmentModel
        .find({
          $or: [
            {
              name: { $regex: filters?.search ?? '', $options: 'i' },
            },
            { description: { $regex: filters?.search ?? '', $options: 'i' } },
          ],
        })
        .sort('-_id')
        .populate({
          path: 'doctor',
          select: '_id firstName lastName',
        })
        .skip(skipPages(pagination))
        .limit(Number(pagination.size))
        .lean();

      const treatmentPatient = treatments.map(async (t) => {
        const patient = await this.patientModel
          .findOne({ treatments: t._id })
          .select('firstName parentName lastName');
        return {
          ...t,
          patient,
        };
      });

      const result = await Promise.all(treatmentPatient);

      const countDocuments = await this.treatmentModel.countDocuments();

      const calculatedPages = calculatePages({
        page: pagination.page,
        size: pagination.size,
        totalPages: countDocuments,
      });

      return formatResponse(result, calculatedPages);
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async deleteTreatment(dto: DeleteTreatmentDto) {
    try {
      await this.treatmentModel.findByIdAndDelete(dto.treatmentId);
      const patient = await this.patientModel.findOne({
        treatments: dto.treatmentId,
      });

      const filteredTreatments = patient.treatments.filter((p) => {
        return p._id.toString() !== dto.treatmentId;
      });

      patient.treatments = filteredTreatments;
      await patient.save();

      return { treatmentId: dto.treatmentId };
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
