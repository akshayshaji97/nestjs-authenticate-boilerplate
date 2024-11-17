import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from '../services/admin.services';
import { createUserDto } from '../dtos/admin-dto';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {
    console.log('user controller');
  }

  @Post('/create-user')
  async create(@Body() body: createUserDto) {
    console.log('---body---', body);
    return true;
  }
}
