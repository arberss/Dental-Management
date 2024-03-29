import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Patient } from 'src/schema/patient.schema';

export interface UserMeDto {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  patients: Patient[];
  createdAt: Date;
}

export class VerifyUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class DoctorIdDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  doctorId: string;
}

export class GetDoctorsQueryDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  search: string;
}
