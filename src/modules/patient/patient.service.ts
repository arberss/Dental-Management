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
import { Model, PipelineStage, Types } from 'mongoose';
import { Patient, PatientDocument } from 'src/schema/patient.schema';
import { TreatmentService } from '../treatment/treatment.service';
import { DeleteTreatmentDto } from '../treatment/dto/treatment.dto';
import { Treatment, TreatmentDocument } from 'src/schema/treatment.schema';
import { PaginationParamsDto } from 'src/dtos/pagination/pagination.dto';
import { formatResponse } from 'src/dtos/pagination/config';
import { User, UserDocument } from 'src/schema/user.schema';
import { calculatePages, skipPages } from 'src/utils';
import { UserMeDto } from '../user/dto/user.dto';
import * as dayjs from 'dayjs';

@Injectable()
export class PatientService {
  @Inject(TreatmentService)
  private readonly treatmentService: TreatmentService;

  constructor(
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Treatment.name)
    private treatmentModel: Model<TreatmentDocument>,
  ) {}

  async addPatientTreatment(dto: CreatePatientWithTreatmentDto) {
    try {
      const checkPatientWithDto = await this.patientModel.findOne({
        firstName: dto.firstName,
        lastName: dto.lastName,
        parentName: dto.parentName,
        dateOfBirth: dto.dateOfBirth,
        ...(dto.contactNumber && { contactNumber: dto.contactNumber }),
      });

      const checkPatientWithId = await this.patientModel.findById(dto._id);

      const treatment = await this.treatmentService.createTreatment(
        dto.treatment,
      );

      if (treatment) {
        let patientTreatment: (Patient & { _id: Types.ObjectId }) | null = null;

        const dataToSet = {
          firstName: dto.firstName,
          parentName: dto.parentName,
          lastName: dto.lastName,
          dateOfBirth: dto.dateOfBirth,
          contactNumber: dto?.contactNumber ?? null,
          address: dto.address,
        };

        if (checkPatientWithDto) {
          throw new ForbiddenException('There is a patient with this data.');
        } else if (checkPatientWithId) {
          patientTreatment = await this.patientModel.findByIdAndUpdate(
            dto._id,
            {
              $addToSet: {
                treatments: treatment._id,
              },
            },
            {
              new: true,
            },
          );
        } else {
          patientTreatment = await this.patientModel.create({
            ...dataToSet,
            treatments: [treatment._id],
          });
        }

        return patientTreatment;
      } else {
        throw new ForbiddenException('Something went wrong');
      }
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
        const patientTreatmentsIds = deletedPatient.treatments.map(
          async (p) => {
            return await this.treatmentModel.findByIdAndDelete(p._id);
          },
        );
        await Promise.all(patientTreatmentsIds);

        return dto.patientId;
      }

      throw new ForbiddenException('Something went wrong');
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async getPatients(
    user: UserMeDto,
    filters: GetPatientQueryDto,
    pagination: PaginationParamsDto,
  ) {
    const isDoctor = user?.roles?.includes('doctor');

    try {
      const patients = await this.patientModel
        .aggregate([
          {
            $lookup: {
              from: 'treatments',
              localField: 'treatments',
              foreignField: '_id',
              as: 'treatmentsData',
            },
          },
          {
            $match: {
              ...(isDoctor && { 'treatmentsData.doctor': user._id }),
              $or: [
                {
                  firstName: { $regex: filters?.search ?? '', $options: 'i' },
                },
                {
                  parentName: { $regex: filters?.search ?? '', $options: 'i' },
                },
                { lastName: { $regex: filters?.search ?? '', $options: 'i' } },
                {
                  contactNumber: {
                    $regex: filters?.search ?? '',
                    $options: 'i',
                  },
                },
              ],
            },
          },
        ])
        .sort('-_id')
        .skip(skipPages(pagination))
        .limit(Number(pagination.size));

      const countDocuments = await this.patientModel.countDocuments();

      const calculatedPages = calculatePages({
        page: pagination.page,
        size: pagination.size,
        totalPages: countDocuments,
      });

      return formatResponse(patients, calculatedPages);
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async getPatient(patientId: string) {
    try {
      const patient = await this.patientModel.findById(patientId);
      return patient;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async getPatientsStats(user: UserMeDto) {
    try {
      const isDoctor = user?.roles?.includes('doctor');

      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);

      const pipeline: PipelineStage[] = [
        {
          $lookup: {
            from: 'treatments',
            localField: 'treatments',
            foreignField: '_id',
            as: 'treatmentsData',
          },
        },
      ];

      if (isDoctor) {
        pipeline.push({
          $match: {
            'treatmentsData.doctor': user?._id,
          },
        });
      }

      pipeline.push({
        $count: 'totalPatients',
      });

      const totalPatientsQuery = await this.patientModel.aggregate(pipeline);

      let totalPatients = 0;
      if (totalPatientsQuery.length > 0) {
        totalPatients = totalPatientsQuery[0].totalPatients;
      }

      const totalTodayTreatments = await this.treatmentModel
        .find({
          ...(isDoctor && { doctor: user?._id }),
          createdAt: { $gte: start, $lt: end },
        })
        .count();

      return {
        totalPatients,
        totalTodayTreatments,
      };
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async getAllStats(user: UserMeDto) {
    const isDoctor = user?.roles?.includes('doctor');

    try {
      const treatmentList = await this.treatmentModel.find({
        ...(isDoctor && { doctor: user?._id }),
      });

      const totalEarning = treatmentList.reduce((acc, val) => {
        return acc + val?.price;
      }, 0);

      const currentMonthTreatments = treatmentList.filter((item) => {
        if (
          dayjs(item.createdAt) >= dayjs().startOf('month') &&
          dayjs(item.createdAt) <= dayjs().endOf('month')
        ) {
          return item;
        }
      });

      const todayTreatmentsEarnings = treatmentList
        .filter((item) => {
          if (
            dayjs(item.createdAt) >= dayjs().startOf('day') &&
            dayjs(item.createdAt) <= dayjs().endOf('day')
          ) {
            return item;
          }
        })
        .reduce((acc, val) => acc + val.price, 0);

      const currentMonthTreatmentsEarnings = currentMonthTreatments.reduce(
        (acc, val) => {
          return acc + val?.price;
        },
        0,
      );

      const patientsStats = await this.getPatientsStats(user);

      return {
        ...patientsStats,
        earnings: totalEarning,
        totalTreatments: treatmentList.length,
        currentMonthTreatments: currentMonthTreatments.length,
        currentMonthEarnings: currentMonthTreatmentsEarnings,
        todayTreatmentsEarnings,
      };
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
