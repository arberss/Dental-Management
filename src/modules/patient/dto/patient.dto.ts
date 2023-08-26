import {
  IsDateString,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateTreatmentDto } from 'src/modules/treatment/dto/treatment.dto';

export class AddressDto {
  @ApiProperty()
  @IsOptional()
  street: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty()
  @IsOptional()
  postalCode: string;
}

export class CreatePatientWithTreatmentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  parentName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: string;

  @ApiProperty()
  @IsOptional()
  contactNumber: string;

  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  address: AddressDto;

  @ApiProperty()
  @IsNotEmpty()
  treatment: CreateTreatmentDto;
}

export class DeletePatientDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  patientId: string;
}

export class UpdatePatientDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  parentName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: string;

  @ApiProperty()
  @IsOptional()
  contactNumber: string;

  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  address: AddressDto;
}

export class GetPatientQueryDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  firstName: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  parentName: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  lastName: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  contactNumber: string;
}
