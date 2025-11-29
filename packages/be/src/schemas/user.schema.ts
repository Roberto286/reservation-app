import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UserRole } from "@reservation-app/shared";
import { HydratedDocument } from "mongoose";

@Schema()
export class User {
  @Prop({ lowercase: true, unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ enum: UserRole, required: true, default: UserRole.User })
  role: UserRole;
}
export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
