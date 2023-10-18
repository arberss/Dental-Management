import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ScheduleStatusEnum } from 'src/modules/scheduler/dto/scheduler.dto';

export type SchedulerDocument = HydratedDocument<Scheduler>;

@Schema({ timestamps: true })
export class Scheduler {
  @Prop()
  title: string;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop({
    enum: [
      ScheduleStatusEnum.active,
      ScheduleStatusEnum.cancelled,
      ScheduleStatusEnum.completed,
    ],
    default: ScheduleStatusEnum.active,
  })
  status: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  doctor: mongoose.Types.ObjectId;
}

export const SchedulerSchema = SchemaFactory.createForClass(Scheduler);
