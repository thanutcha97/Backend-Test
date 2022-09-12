import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Purchease, PurcheaseSchema } from 'src/schema/purchase.schema';
import { BookModule } from 'src/book/book.module';

@Module({
  
  imports:
    [
      BookModule,
      MongooseModule.forFeature([{ name: Purchease.name, schema: PurcheaseSchema }] , 'bookshop' ),
    ],
  controllers: [PurchaseController],
  providers: [PurchaseService],
  exports: [PurchaseService]
})
export class PurchaseModule {}
