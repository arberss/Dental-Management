import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Treatment, TreatmentSchema } from 'src/schema/treatment.schema';
import { TreatmentService } from './treatment.service';
import { TreatmentController } from './treatment.controller';
import { Patient, PatientSchema } from 'src/schema/patient.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Treatment.name, schema: TreatmentSchema },
    ]),
    MongooseModule.forFeature([{ name: Patient.name, schema: PatientSchema }]),
  ],
  providers: [TreatmentService],
  controllers: [TreatmentController],
  exports: [TreatmentService],
})
export class TreatmentModule {}
