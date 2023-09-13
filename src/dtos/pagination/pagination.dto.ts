import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PaginationParamsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  page: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  size: string;
}
