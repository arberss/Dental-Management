import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Treatment, TreatmentDocument } from 'src/schema/treatment.schema';
import {
  CreateTreatmentDto,
  DeleteTreatmentDto,
  UpdateTreatmentDto,
} from './dto/treatment.dto';

@Injectable()
export class TreatmentService {
  constructor(
    @InjectModel(Treatment.name)
    private treatmentModel: Model<TreatmentDocument>,
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

  async deleteTreatment(dto: DeleteTreatmentDto) {
    try {
      await this.treatmentModel.findByIdAndDelete(dto.treatmentId);
      return dto.treatmentId;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
