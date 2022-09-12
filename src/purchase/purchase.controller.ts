import { Request , UseGuards ,Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { RolesGuard } from 'src/auth/role.guard';
import Role from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';
import { PurcheaseBook } from 'src/book/dto/create-purchease.dto';

@Controller('purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.User)
  @Post('buyBook')
  buyBook(@Request() req , @Body() purcheaseBook : PurcheaseBook) {
    return this.purchaseService.buyBook( req.user , purcheaseBook);
  }


}
