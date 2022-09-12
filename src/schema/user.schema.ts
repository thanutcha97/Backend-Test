import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NodeWorker } from 'inspector';
import { Document } from 'mongoose';
import Role from 'src/auth/role.enum';
import { User } from '../users/entities/user.entity';

export type UserDocument = User & Document;

@Schema()
export class users {
  @Prop()
  username: string;

  @Prop()
  name: string;

  @Prop()
  password: string;

  @Prop({ default:'Active' })
  status: string

  @Prop({ default: Date.now })
  registerDate: Date

  @Prop({ type: String, enum: Role, default: Role.User })
  public role: Role;
}

export const UserSchema = SchemaFactory.createForClass(users);
