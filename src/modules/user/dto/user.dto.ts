import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Patient } from 'src/schema/patient.schema';

export interface UserMeDto {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  patients: Patient[];
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
