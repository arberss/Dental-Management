import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PatientDocument = HydratedDocument<Patient>;

@Schema()
export class Address {
  @Prop()
  street: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  postalCode: string;
}
@Schema({ timestamps: true })
export class Patient {
  @Prop()
  firstName: string;

  @Prop()
  parentName: string;

  @Prop()
  lastName: string;

  @Prop()
  dateOfBirth: Date;

  @Prop()
  contactNumber: string;

  @Prop({ type: Address })
  address: Address;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Treatment' }] })
  treatments: mongoose.Types.ObjectId[];
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
