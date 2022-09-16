import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BookDocument } from '../schema/book.schema';
import { UserDocument } from 'src/schema/user.schema';


@Injectable()
export class BookService {

  constructor(@InjectModel( Book.name , 'bookshop') private BookModel : Model<BookDocument> ,
  
  ) {}

  //create
  async create( book : CreateBookDto) {

    const newBook =  await new this.BookModel(book).save();
    return newBook;
  
  }

  //showbooklist
  async findAll() {
    const Booklist = await this.BookModel.find();
    if(Booklist.length>0){
      return Booklist
    }else{
      return `Is Empty`
    }
  }


  async findOne( id : string ) {
    const Booklist = await this.BookModel.findById(id);
    return Booklist
  }


  async findbyname(name: string) {
    const Searchbook = await this.BookModel.find({
      name : { $regex: name , $options: 'i' } 
    });
    
    if(Searchbook.length>0){
      return Searchbook
    }else{
      return `Data Not Found`
    }
    
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
  const updateBook = await this.BookModel.findByIdAndUpdate( id , updateBookDto )
  return updateBook;
  }

   
  async remove(id: string) {
    const deleteBook = await this.BookModel.findByIdAndRemove({ _id: id }).exec();
    if(deleteBook){
      return deleteBook;  
    }else{
      throw new HttpException('book was not found for parameters' , HttpStatus.BAD_REQUEST);
    }
  }

  async sortbyprice(select : string){

    let bookSortbypice = []

    if( select == 'asc' ){
      bookSortbypice = await this.BookModel.find().sort({ price : 1})
    }else{
      bookSortbypice = await this.BookModel.find().sort({ price : -1})
    }
    return bookSortbypice 
  }

  async sortbyamount(select : string){

    let sortbyamount = []
    if( select == 'asc' ){
      sortbyamount = await this.BookModel.find().sort({ amount : 1})
    }else{
      sortbyamount = await this.BookModel.find().sort({ amount : -1})
    }
    return sortbyamount
  }

}
