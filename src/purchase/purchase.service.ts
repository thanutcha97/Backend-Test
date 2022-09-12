import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BookService } from 'src/book/book.service';
import { PurcheaseBook } from 'src/book/dto/create-purchease.dto';
import { Purchease, PurcheaseDocument } from 'src/schema/purchase.schema';

import { Purchase } from './entities/purchase.entity';


@Injectable()
export class PurchaseService {

  constructor(
    @InjectModel(Purchease.name, 'bookshop') private PurcheaseModel: Model<PurcheaseDocument>,
    private bookService: BookService
  ) { }

  async buyBook(user: any, purcheaseBook: PurcheaseBook) {

    //จำนวนหนังสือปัจจุบัน
    const bookInfo = await this.bookService.findOne(purcheaseBook.id)
    const bookSell = await this.PurcheaseModel.aggregate(
      [
        { $match: { bookID: purcheaseBook.id } },
        {
          $group: {
            _id: null,
            qtySell: { $sum: "amount" }
          }
        }
      ]
    )

    if (bookInfo == null) {
      return 'not found book'
    }

    if (bookInfo.amount == 0) {
      return (`sold out`)
    }
    let amountSell = 0;
    if(bookSell.length > 0)
    {
      amountSell =  bookSell[0].qtySell
    }
    
    const amountCurrent = bookInfo.amount - (amountSell + purcheaseBook.amount);
    // const userInfo = await this.UserModel.find({ _id : user._id})
    if (amountCurrent < 0) {
      return (`จำนวนหนังสือไม่พอ`)
    }

    await this.PurcheaseModel.create({

      UserId: user.id,
      bookID: bookInfo._id,
      username: user.username,
      bookName: bookInfo.name,
      priceBook: bookInfo.price,
      bookType: bookInfo.typename,
      amount: purcheaseBook.amount

    })

    //บันทึกข้อมูลหนังสือคงเหลือ
    bookInfo.amount = amountCurrent;
    bookInfo.save();

    return 'success'

  }

}
