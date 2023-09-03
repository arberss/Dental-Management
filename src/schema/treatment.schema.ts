import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TreatmentDocument = HydratedDocument<Treatment>;

@Schema({ timestamps: true })
export class Treatment {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  price: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  doctor: mongoose.Types.ObjectId;
}

export const TreatmentSchema = SchemaFactory.createForClass(Treatment);
TreatmentSchema.index({ createdAt: 1 });
