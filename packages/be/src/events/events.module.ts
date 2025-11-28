import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "src/auth/auth.module";
import { Event, EventSchema } from "src/schemas/event.schema";
import { EventsController } from "./events.controller";
import { EventsService } from "./events.service";

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
