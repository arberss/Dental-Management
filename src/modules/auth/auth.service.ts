import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schema/user.schema';
import { LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signin(dto: LoginDto) {
    try {
      const user = await this.userModel.findOne({
        email: dto.email,
      });

      if (!user) {
        throw new NotFoundException('This user does not exist!');
      }

      const isPasswordValid = await bcrypt.compare(dto.password, user.password);
      if (!isPasswordValid) {
        throw new ForbiddenException('Password is not correct!');
      }

      const token = await this.signToken({
        id: user._id.toString(),
        email: user.email,
        role: user.roles,
      });

      return {
        id: user._id.toString(),
        token: token.access_token,
      };
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async signToken({
    id,
    email,
    role,
  }: {
    id: string;
    email: string;
    role: string[];
  }): Promise<{ access_token: string }> {
    const token = this.jwtService.sign(
      { id, email, role },
      {
        expiresIn: '600m',
        secret: this.config.get('JWT_SECRET'),
      },
    );

    return { access_token: token };
  }
}
