import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Treatment, TreatmentSchema } from 'src/schema/treatment.schema';
import { TreatmentService } from './treatment.service';
import { TreatmentController } from './treatment.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Treatment.name, schema: TreatmentSchema },
    ]),
  ],
  providers: [TreatmentService],
  controllers: [TreatmentController],
  exports: [TreatmentService],
})
export class TreatmentModule {}
