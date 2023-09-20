import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AnyOfRole } from 'src/guards/role/role.decorator';
import { RolesGuard } from 'src/guards/role/role.guard';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { AddScheduleDto, UpdateScheduleDto } from './dto/scheduler.dto';
import { SchedulerService } from './scheduler.service';

@ApiTags('Schedulers')
@ApiBearerAuth()
@Controller('schedulers')
@UseGuards(JwtAuthGuard)
export class SchedulerController {
  constructor(private schedulerService: SchedulerService) {}

  @AnyOfRole(['admin', 'doctor'])
  @UseGuards(RolesGuard)
  @Post('/add')
  addSchedule(@Body() dto: AddScheduleDto) {
    return this.schedulerService.addSchedule(dto);
  }

  @AnyOfRole(['admin', 'doctor'])
  @UseGuards(RolesGuard)
  @Put('/update')
  updateSchedule(@Body() dto: UpdateScheduleDto) {
    return this.schedulerService.updateSchedule(dto);
  }

  @AnyOfRole(['admin', 'doctor'])
  @UseGuards(RolesGuard)
  @Get('/all')
  getScheduls() {
    return this.schedulerService.getScheduls();
  }
}
