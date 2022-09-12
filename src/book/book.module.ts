import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Book } from './entities/book.entity';
import { BookSchema } from '../schema/book.schema';
import { Purchease, PurcheaseSchema } from 'src/schema/purchase.schema';

@Module({

  imports:
    [
      // MongooseModule.forFeature([{ name: Book.name, schema: BookSchems }])
      MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }, ] , 'bookshop' ),
    ],

  controllers: [BookController],
  providers: [BookService],
  exports: [BookService]


})
export class BookModule { }
