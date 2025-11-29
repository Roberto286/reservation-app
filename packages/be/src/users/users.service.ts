import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";
import { Model } from "mongoose";
import { User, UserDocument } from "src/schemas/user.schema";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>
  ) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(userId: string): Promise<UserDocument | null> {
    return this.userModel.findById(userId).exec();
  }

  async createUser(email: string, password: string): Promise<UserDocument> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new this.userModel({ email, password: hashedPassword });
    return user.save();
  }
}
