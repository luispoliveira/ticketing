import {Listener, OrderCreatedEvent, Subjects} from "@lpotickets/common";
import {Message} from "node-nats-streaming";
import {queueGroupName} from "./queue-group-name";
import {Ticket} from "../../models/ticket";

import {TicketUpdatedPublisher} from "../publishers/ticket-updated-publisher";


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    async onMessage(data: OrderCreatedEvent["data"], msg: Message): Promise<void> {
        //find the ticket that the order is reserving
        const ticket = await Ticket.findById(data.ticket.id);
        //if no ticket, throw error
        if (!ticket) {
            throw new Error('Ticker not found');
        }
        //mark the ticket as being reserved by setting its orderId property
        ticket.set({orderId: data.id});
        //save the ticket
        await ticket.save();
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            orderId: ticket.orderId,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            version: ticket.version
        });
        //ack the message

        msg.ack();
    }

    queueGroupName: string = queueGroupName;
    subject: Subjects.OrderCreated = Subjects.OrderCreated;

}
