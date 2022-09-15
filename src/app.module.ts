import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PurchaseModule } from './purchase/purchase.module';


@Module({
  imports: [
    BookModule ,
    PurchaseModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017', {
      connectionName: 'bookshop',}),
    UsersModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
