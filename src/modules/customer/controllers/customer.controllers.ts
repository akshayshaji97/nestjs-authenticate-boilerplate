import { Body, Controller, Post } from '@nestjs/common';
import { CustomerService } from '../services/customer.services';
import { createUserDto } from '../dtos/customer-dto';

@Controller('customer')
export class CustomerController {
  constructor(private CustomerService: CustomerService) {
    console.log('Customer controller');
  }

  @Post('/create-user')
  async create(@Body() body: createUserDto) {
    console.log('---body---', body);
    return true;
  }
}
