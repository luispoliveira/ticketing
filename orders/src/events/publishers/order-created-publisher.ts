import {Publisher, OrderCreatedEvent, Subjects} from "@lpotickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}