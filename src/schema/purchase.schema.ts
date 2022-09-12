import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NodeWorker } from 'inspector';
import { Document } from 'mongoose';
import Role from 'src/auth/role.enum';
import { User } from '../users/entities/user.entity';

export type PurcheaseDocument = Purchease & Document;

@Schema()
export class Purchease {

  @Prop()
  UserId : string;
  
  @Prop()
  bookID: string;

  @Prop({ default: Date.now })
  buyDate: Date

  @Prop()
  username : string;

  @Prop()
  bookName : string;

  @Prop()
  priceBook : number;

  @Prop()
  bookType : string;

  @Prop()
  amount : Number;
}

export const PurcheaseSchema = SchemaFactory.createForClass(Purchease);
