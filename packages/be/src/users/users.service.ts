import { ConflictException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { SignupRequestDto } from "@reservation-app/shared";
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

  async createUser(user: SignupRequestDto): Promise<UserDocument> {
    const { role, email, password } = user;

    // Verifica se esiste già un utente con questa email
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException("Un utente con questa email esiste già");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new this.userModel({
      email,
      password: hashedPassword,
      role,
    });
    return newUser.save();
  }
}
