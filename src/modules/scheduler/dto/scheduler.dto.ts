import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class AddScheduleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty({
    enum: ['active, cancelled, completed'],
    default: 'active',
  })
  @IsOptional()
  status: ScheduleStatusEnum;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  doctor: string;
}

export class UpdateScheduleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty({
    enum: ['active, cancelled, completed'],
    default: 'active',
  })
  @IsString()
  @IsNotEmpty()
  status: ScheduleStatusEnum;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  doctor: Types.ObjectId;
}

export enum ScheduleStatusEnum {
  active = 'active',
  cancelled = 'cancelled',
  completed = 'completed',
}
