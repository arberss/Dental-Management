import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { User, UserSchema } from 'src/schema/user.schema';
import { UserService } from './user.service';
import { MailModule } from '../mail/mail.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({}),
    MailModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [JwtModule],
})
export class UserModule {}
