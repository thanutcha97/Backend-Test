import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BookService } from 'src/book/book.service';
import { PurcheaseBook } from 'src/book/dto/create-purchease.dto';
import { Purchease, PurcheaseDocument } from 'src/schema/purchase.schema';
import { UsersService } from 'src/users/users.service';

import { Purchase } from './entities/purchase.entity';


@Injectable()
export class PurchaseService {

  constructor(
    @InjectModel(Purchease.name, 'bookshop') private PurcheaseModel: Model<PurcheaseDocument>,
    private bookService: BookService,
    private userSevice: UsersService

  ) { }

  async buyBook(user: any, purcheaseBook: PurcheaseBook) {

    //จำนวนหนังสือปัจจุบัน
    const bookInfo = await this.bookService.findOne(purcheaseBook.id)
    const userStatus = await this.userSevice.checkStatus(user.id)
    console.log(userStatus);
    
    if(userStatus == null){
    return 'Block User'
    }
    
    const bookSell = await this.PurcheaseModel.aggregate(
      [
        { $match: { bookID: purcheaseBook.id} },
        {
          $group: {
            _id: null,
            qtySell: { $sum: "amount" }
          }
        }
      ]
    )

    if (bookInfo == null) {
      return 'The book was not found'
    }

    if (bookInfo.amount == 0) {
      return (`Sold Out`)
    }
    let amountSell = 0;
    if(bookSell.length > 0)
    {
      amountSell =  bookSell[0].qtySell
    }
    
    const amountCurrent = bookInfo.amount - (amountSell + purcheaseBook.amount);
    // const userInfo = await this.UserModel.find({ _id : user._id})
    if (amountCurrent < 0) {
      return (`Not enough books`)
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

    return 'Successful Purchase'

  }

  async findHistoryALL() {
    const History = await this.PurcheaseModel.find();
    if(History.length>0){
      return History
    }else{
      return `Is Empty`
    }
  }

  async reportPurchase( type : String ) {
    const reportPurchase = await this.PurcheaseModel.find({ bookType : type }).select({
      bookName: 1, 
      priceBook: 1
    });
    if(reportPurchase){
      return reportPurchase
    }else{
      return `No reports of book sales in this category`
    }

  }

  async reportUser( id : String ) {
    const reportUser = await this.PurcheaseModel.find({ UserId : id });
    if(reportUser){
      return reportUser
    }else{
      return `Users have no reports of book purchases.`
    }
  }
}
