import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Event } from "./event.schema";
import { User } from "./user.schema";

export enum BookingStatus {
  Pending = "PENDING",
  Confirmed = "CONFIRMED",
  Cancelled = "CANCELLED",
}

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: Types.ObjectId, ref: Event.name, required: true, index: true })
  eventId!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
    index: true,
  })
  attendeeId!: Types.ObjectId;

  @Prop({ type: Number, required: true, min: 1 })
  seats!: number;

  @Prop({ type: String, enum: BookingStatus, default: BookingStatus.Pending })
  status!: BookingStatus;

  @Prop({ type: Date })
  cancelledAt?: Date;

  createdAt!: Date;
  updatedAt!: Date;
}

export type BookingDocument = HydratedDocument<Booking>;
export const BookingSchema = SchemaFactory.createForClass(Booking);

BookingSchema.index({ eventId: 1, status: 1 });
// BookingSchema.virtual("eventDetail", {
//   ref: "Event", // il modello a cui fare riferimento
//   localField: "eventId", // campo nel Booking
//   foreignField: "_id", // campo nell'Event
//   justOne: true, // perché ogni booking ha un solo evento
// });
// BookingSchema.set("toObject", { virtuals: true });
// BookingSchema.set("toJSON", { virtuals: true });
