import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  registerToken: string;

  @Prop({ default: 'pending' })
  status: string;

  @Prop({ default: ['doctor'] })
  roles: ['doctor', 'admin'];
}

export const UserSchema = SchemaFactory.createForClass(User);
