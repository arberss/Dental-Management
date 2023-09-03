import {
  IsDateString,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateTreatmentDto } from 'src/modules/treatment/dto/treatment.dto';
import { Type } from 'class-transformer';

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

const validateFieldOptions = [null, undefined, ''];

export class CreatePatientWithTreatmentDto {
  @ApiProperty()
  @ValidateIf((o) => validateFieldOptions.includes(o.firstName))
  @ValidateIf((o) => validateFieldOptions.includes(o.parentName))
  @ValidateIf((o) => validateFieldOptions.includes(o.lastName))
  @ValidateIf((o) => validateFieldOptions.includes(o.dateOfBirth))
  @ValidateIf((o) => validateFieldOptions.includes(o.address))
  @IsNotEmpty()
  _id: string;

  @ApiProperty()
  @ValidateIf((o) => validateFieldOptions.includes(o._id))
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @ValidateIf((o) => validateFieldOptions.includes(o._id))
  @IsNotEmpty()
  parentName: string;

  @ApiProperty()
  @ValidateIf((o) => validateFieldOptions.includes(o._id))
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @ValidateIf((o) => validateFieldOptions.includes(o._id))
  @IsNotEmpty()
  dateOfBirth: string;

  @ApiProperty()
  @IsOptional()
  contactNumber: string;

  @ApiProperty()
  @ValidateIf((o) => validateFieldOptions.includes(o._id))
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => CreateTreatmentDto)
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
  search: string;
}

export class GetPatientByIdDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  patientId: string;
}
