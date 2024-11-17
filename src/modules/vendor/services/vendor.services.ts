import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { SignupRequestDto } from '../dtos';
import { InjectModel } from '@nestjs/mongoose';
import { Vendor } from '../schemas/vendor.schema';
import { FilterQuery, Model, Types } from 'mongoose';
import config from 'src/config';
import { generateOTP, generatePasswordHash } from 'src/common/utils';
import { UserTypes } from 'src/common/enums';
@Injectable()
export class VendorService {
  constructor(@InjectModel(Vendor.name) private vendorModel: Model<Vendor>) {}
  private readonly logger = new Logger();

  async getVendor(filter: FilterQuery<Vendor>, select?: string) {
    const query = this.vendorModel.findOne(filter);
    if (select) {
      query.select(select);
    }
    return await query.lean();
  }

  async getVendorById(id: Types.ObjectId) {
    return await this.vendorModel.findById(id).lean();
  }

  async getVendorts(filter: FilterQuery<Vendor>, select?: string) {
    const query = this.vendorModel.find(filter);
    if (select) {
      query.select(select);
    }
    return await query.lean();
  }

  async signUp(data: SignupRequestDto): Promise<{ _id: Types.ObjectId }> {
    const { phone, email, name, password } = data;

    const existingEmail = await this.vendorModel.findOne({ email }).lean();

    if (existingEmail) {
      throw new BadRequestException('Email name already exists');
    }

    const existingPhone = await this.vendorModel.findOne({ phone }).lean();

    if (existingPhone) {
      throw new BadRequestException('Phone name already exists');
    }

    const otpData = {
      otp: config.authentication.liveOTP
        ? generateOTP()
        : config.authentication.debugOTP,
      otpExpiryAt: new Date(new Date().setMinutes(new Date().getMinutes() + 3)),
    };
    this.logger.log('otpData--', otpData);
    const { hashedPassword } = await generatePasswordHash(password);
    const vendor = await this.vendorModel.create({
      name,
      email,
      phone,
      hashedPassword: hashedPassword.toString(),
      role: UserTypes.Vendor,
      emailVerified: false,
      phoneVerified: false,
      isActive: true,
    });
    return { _id: vendor._id };
  }
}
