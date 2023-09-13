import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { User, UserSchema } from 'src/schema/user.schema';
import { UserService } from './user.service';
import { MailModule } from '../mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { Treatment, TreatmentSchema } from 'src/schema/treatment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: Treatment.name, schema: TreatmentSchema },
    ]),
    JwtModule.register({}),
    MailModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [JwtModule],
})
export class UserModule {}
