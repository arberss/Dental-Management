import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schema/user.schema';
import { RegisterDto } from '../auth/dto/auth.dto';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
import { PaginationParamsDto } from 'src/dtos/pagination/pagination.dto';
import { DoctorIdDto, GetDoctorsQueryDto } from './dto/user.dto';
import { calculatePages, skipPages } from 'src/utils';
import { formatResponse } from 'src/dtos/pagination/config';

@Injectable()
export class UserService {
  @Inject(MailService)
  private readonly mailService: MailService;

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(User.name)
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async getUsers() {
    try {
      const users = await this.userModel.aggregate([
        {
          $lookup: {
            from: 'patients',
            localField: 'patients',
            foreignField: '_id',
            as: 'patientCount',
          },
        },
        {
          $project: {
            _id: 1,
            username: 1,
            firstName: 1,
            lastName: 1,
            email: 1,
            patients: { $size: '$patientCount' },
          },
        },
      ]);

      if (!users || users.length < 1) {
        throw new NotFoundException('Something went wrong!');
      }

      return users;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async getDoctors(
    filters: GetDoctorsQueryDto,
    pagination: PaginationParamsDto,
  ) {
    try {
      const doctors = await this.userModel
        .find({
          firstName: { $regex: filters?.firstName ?? '', $options: 'i' },
          lastName: { $regex: filters?.lastName ?? '', $options: 'i' },
          roles: 'doctor',
        })
        .select('-registerToken -password')
        .skip(skipPages(pagination))
        .limit(Number(pagination.size));

      const countDocuments = await this.userModel.countDocuments();

      const calculatedPages = calculatePages({
        page: pagination.page,
        size: pagination.size,
        totalPages: countDocuments,
      });

      return formatResponse(doctors, calculatedPages);
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async getDoctor(dto: DoctorIdDto) {
    try {
      const doctor = await this.userModel
        .findOne({
          _id: dto.doctorId,
          roles: 'doctor',
        })
        .select('-password -registerToken')
        .populate({
          path: 'patients',
        });

      if (!doctor) {
        throw new NotFoundException('There is no doctor with that id');
      }
      return doctor;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async registerUser(dto: RegisterDto) {
    try {
      const user = await this.userModel
        .findOne({
          email: dto.email,
        })
        .select('-password -patients');

      if (user) {
        throw new NotFoundException('This user exist!');
      }

      const token = await this.signToken({
        email: dto.email,
        role: dto.roles,
      });

      await this.mailService.sendMail({
        to: 'arberssalihuu@gmail.com',
        subject: 'Dental Management - Configure your account',
        template: 'registerUser', //
        context: {
          fullName: `${dto.firstName} ${dto.lastName}`,
          role: dto.roles[0],
          link: `${this.config.get(
            'FRONT_DOMAIN',
          )}/verify-registered-user/token?verifyToken=${token.access_token}`,
        },
      });

      const createdUser = await this.userModel.create({
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        registerToken: token.access_token,
        roles: dto?.roles ?? ['doctor'],
        patients: [],
      });

      return {
        _id: createdUser?._id,
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        roles: dto?.roles ?? ['doctor'],
      };
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async verifyRegisteredUser(token: string, password: string) {
    try {
      if (!password) {
        throw new NotFoundException('Password is required');
      }

      const user = await this.userModel.findOne({ registerToken: token });
      if (!user) {
        throw new NotFoundException("This user don't exist or is registered!");
      }

      const checkToken = await this.jwtService.verify(token, {
        secret: this.config.get('JWT_SECRET'),
      });
      if (!checkToken) {
        throw new ForbiddenException('Token is not valid!');
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      user.password = hashedPassword;
      user.registerToken = null;
      await user.save();

      return {
        message: 'The user is verified!',
      };
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async signToken({
    email,
    role,
  }: {
    email: string;
    role: string[];
  }): Promise<{ access_token: string }> {
    const token = this.jwtService.sign(
      { email, role },
      {
        expiresIn: '30m',
        secret: this.config.get('JWT_SECRET'),
      },
    );

    return { access_token: token };
  }
}
