import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Scheduler, SchedulerDocument } from 'src/schema/scheduler.schema';
import {
  AddScheduleDto,
  ScheduleStatusEnum,
  UpdateScheduleDto,
} from './dto/scheduler.dto';
import * as dayjs from 'dayjs';

@Injectable()
export class SchedulerService {
  constructor(
    @InjectModel(Scheduler.name)
    private schedulerModel: Model<SchedulerDocument>,
  ) {}

  async addSchedule(dto: AddScheduleDto) {
    try {
      const existingSchedules = await this.schedulerModel.find({
        doctor: dto.doctor,
        status: {
          $ne: ScheduleStatusEnum.cancelled,
        },
        $or: [
          {
            $and: [
              { startDate: { $lte: dto.startDate } },
              { endDate: { $gte: dto.endDate } },
            ],
          },
          {
            $and: [
              { startDate: { $gte: dto.startDate } },
              { endDate: { $lte: dto.endDate } },
            ],
          },
          {
            $and: [
              { startDate: { $lte: dto.startDate } },
              { endDate: { $gte: dto.startDate } },
            ],
          },
          {
            $and: [
              { startDate: { $lte: dto.endDate } },
              { endDate: { $gte: dto.endDate } },
            ],
          },
        ],
      });

      if (existingSchedules.length > 0) {
        throw new ForbiddenException('These dates are reserved');
      }

      const createdScheduler = await this.schedulerModel.create(dto);
      return createdScheduler;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async updateSchedule(dto: UpdateScheduleDto) {
    try {
      const existingSchedules = await this.schedulerModel.find({
        doctor: dto.doctor,
        status: {
          $ne: ScheduleStatusEnum.cancelled,
        },
      });

      const filteredSchedules = existingSchedules.filter(
        (item) => item._id.toString() !== dto.id,
      );

      const checkExistingSchedules = filteredSchedules.filter((item) => {
        return (
          (dayjs(item.startDate).toDate() <= dayjs(dto.startDate).toDate() &&
            dayjs(item.endDate).toDate() >= dayjs(dto.endDate).toDate()) ||
          (dayjs(item.startDate).toDate() >= dayjs(dto.startDate).toDate() &&
            dayjs(item.endDate).toDate() <= dayjs(dto.endDate).toDate()) ||
          (dayjs(item.startDate).toDate() <= dayjs(dto.startDate).toDate() &&
            dayjs(item.endDate).toDate() >= dayjs(dto.startDate).toDate()) ||
          (dayjs(item.startDate).toDate() <= dayjs(dto.endDate).toDate() &&
            dayjs(item.endDate).toDate() >= dayjs(dto.endDate).toDate())
        );
      });

      if (checkExistingSchedules.length > 0) {
        throw new ForbiddenException('These dates are reserved');
      }

      const schedule = await this.schedulerModel.findById(dto.id);
      if (!schedule) {
        throw new NotFoundException('This schedule does not exist!');
      }

      schedule.title = dto.title;
      schedule.startDate = dto.startDate;
      schedule.endDate = dto.endDate;
      schedule.status = dto.status;
      schedule.doctor = dto.doctor;
      schedule.save();

      return schedule;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async getScheduls() {
    try {
      const schedules = await this.schedulerModel
        .find()
        .populate({ path: 'doctor', select: 'firstName lastName' });

      return schedules;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
