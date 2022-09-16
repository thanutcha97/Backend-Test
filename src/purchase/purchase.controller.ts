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

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Get()
  findAll() {
    return this.purchaseService.findHistoryALL();
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Get('report/:type')
  async reportPurchase( @Param('type') type: string ) {
      const items = await this.purchaseService.reportPurchase(type);
      return {
        items,
        count: items.length,
        typeBook: type
      }
    }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)  
  @Get('reportUser/:id')
  async reportUser( @Param('id') id: string ) {
      const items = await this.purchaseService.reportUser(id);
      return items;
    }
  }
