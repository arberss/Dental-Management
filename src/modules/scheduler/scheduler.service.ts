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
import { UserMeDto } from '../user/dto/user.dto';

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

  async getSchedules(user: UserMeDto) {
    try {
      const isDoctor = user?.roles?.includes('doctor');

      const schedules = await this.schedulerModel
        .find({
          ...(isDoctor && { doctor: user._id }),
        })
        .populate({ path: 'doctor', select: 'firstName lastName' });

      return schedules;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async completePastSchedules() {
    try {
      const yesterdayDate = dayjs().startOf('day').add(-1, 'day').toDate();

      const schedules = await this.schedulerModel.find({
        endDate: {
          $gte: yesterdayDate, // Greater than or equal to yesterday start date
          $lt: dayjs(yesterdayDate).endOf('day').toDate(), // Less than today
        },
        status: ScheduleStatusEnum.active,
      });

      if (schedules?.length > 0) {
        const mappedSchedules = schedules.map(async (schedule) => {
          const foundSchedule = await this.schedulerModel.findById(
            schedule._id,
          );

          foundSchedule.status = ScheduleStatusEnum.completed;
          foundSchedule.save();
          return foundSchedule;
        });

        await Promise.all(mappedSchedules);
      }
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
