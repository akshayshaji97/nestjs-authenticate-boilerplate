import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { User } from '../schemas/user.chema';
// import { Model } from 'mongoose';

@Injectable()
export class CustomerService {
  constructor() {} // private userModel: Model<User>, // @InjectModel(User.name)

  async createUser() {
    // const user = new this.userModel({});
  }
}
