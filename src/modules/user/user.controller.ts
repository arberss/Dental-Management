import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator/getUser.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import {
  DoctorIdDto,
  GetDoctorsQueryDto,
  UserMeDto,
  VerifyUserDto,
} from './dto/user.dto';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AllRoles, AnyOfRole } from 'src/guards/role/role.decorator';
import { RolesGuard } from 'src/guards/role/role.guard';
import { RegisterDto } from '../auth/dto/auth.dto';
import { PaginationParamsDto } from 'src/dtos/pagination/pagination.dto';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@GetUser() user: UserMeDto) {
    return user;
  }

  @AllRoles(['admin'])
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('all')
  getUsers() {
    return this.userService.getUsers();
  }

  @AnyOfRole(['admin', 'doctor'])
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('doctors')
  getDoctors(
    @Query() filters: GetDoctorsQueryDto,
    @Query() pagination: PaginationParamsDto,
  ) {
    return this.userService.getDoctors(filters, pagination);
  }

  @AllRoles(['admin'])
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('doctor/:doctorId')
  getDoctor(@Param() dto: DoctorIdDto) {
    return this.userService.getDoctor(dto);
  }

  @AllRoles(['admin'])
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post('registerUser')
  registerUser(@Body() dto: RegisterDto) {
    return this.userService.registerUser(dto);
  }

  @Put('verifyRegisteredUser')
  verifyRegisteredUser(@Body() dto: VerifyUserDto) {
    return this.userService.verifyRegisteredUser(dto.token, dto.password);
  }
}
