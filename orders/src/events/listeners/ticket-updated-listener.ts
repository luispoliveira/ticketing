import {Message} from 'node-nats-streaming';
import {Listener, Subjects, TicketUpdatedEvent} from "@lpotickets/common";
import {queueGroupName} from "./queue-group-name";
import {Ticket} from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    async onMessage(data: TicketUpdatedEvent["data"], msg: Message): Promise<void> {

        const ticket = await Ticket.findByEvent(data);

        if (!ticket) {
            throw new Error('Ticket not found');
        }

        const {title, price} = data;
        ticket.set({title, price});
        await ticket.save();

        msg.ack();
    }

    queueGroupName: string = queueGroupName;
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;

}