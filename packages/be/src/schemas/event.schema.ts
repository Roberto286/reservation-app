import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { EventCategory } from "@reservation-app/shared";
import type { HydratedDocument } from "mongoose";
import { Types } from "mongoose";

export enum EventStatus {
  Draft = "DRAFT",
  Published = "PUBLISHED",
  Cancelled = "CANCELLED",
  Completed = "COMPLETED",
}

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true, minlength: 3, maxlength: 140, trim: true })
  title!: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ trim: true })
  location?: string;

  @Prop({ type: Date, required: true })
  startAt!: Date;

  @Prop({
    type: Date,
    required: true,
    validate: {
      validator(value: Date) {
        return !this.startAt || value > this.startAt;
      },
      message: "endAt must be greater than startAt",
    },
  })
  endAt!: Date;

  @Prop({ type: Number, required: true, min: 1 })
  maxParticipants!: number;

  @Prop({ type: Number, default: 0, min: 0 })
  reservedSeats!: number;

  @Prop({ type: String, enum: EventStatus, default: EventStatus.Draft })
  status!: EventStatus;

  @Prop({ type: String, enum: EventCategory, required: true })
  category!: EventCategory;

  @Prop({ type: Types.ObjectId, ref: "User" })
  organizerId!: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  tags!: string[];
}

export type EventDocument = HydratedDocument<Event>;
export const EventSchema = SchemaFactory.createForClass(Event);
