import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Patient, PatientSchema } from 'src/schema/patient.schema';
import { TreatmentModule } from '../treatment/treatment.module';
import { Treatment, TreatmentSchema } from 'src/schema/treatment.schema';
import { User, UserSchema } from 'src/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Patient.name, schema: PatientSchema }]),
    MongooseModule.forFeature([
      { name: Treatment.name, schema: TreatmentSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({}),
    TreatmentModule,
  ],
  providers: [PatientService],
  controllers: [PatientController],
  exports: [JwtModule],
})
export class PatientModule {}
