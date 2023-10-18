import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { Scheduler, SchedulerSchema } from 'src/schema/scheduler.schema';
import { SchedulerController } from './scheduler.controller';
import { SchedulerService } from './scheduler.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Scheduler.name, schema: SchedulerSchema },
    ]),
    JwtModule.register({}),
    ScheduleModule.forRoot(),
  ],
  controllers: [SchedulerController],
  providers: [SchedulerService],
  exports: [JwtModule],
})
export class SchedulerModule {}
