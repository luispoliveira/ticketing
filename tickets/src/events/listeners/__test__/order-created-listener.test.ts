import {OrderCreatedListener} from "../order-created-listener";
import {natsWrapper} from "../../../nats-wrapper";
import {Ticket} from "../../../models/ticket";
import {OrderCreatedEvent, OrderStatus} from "@lpotickets/common";
import mongoose from "mongoose";
import {Message} from "node-nats-streaming";

const setup = async () => {
    // create an instance of the listener
    const listener = new OrderCreatedListener(natsWrapper.client);
    //create and save a ticket
    const ticket = Ticket.build({
        title: 'test',
        price: 99,
        userId: 'asdasd'
    });

    await ticket.save();

    //create the fake data event

    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        expiresAt: 'asdasdasd',
        ticket: {
            id: ticket.id,
            price: ticket.price
        },
        userId: 'asdasd',
        version: 0,
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {listener, ticket, data, msg};
}

it('sets the userId of the ticket', async () => {
    const {listener, ticket, data, msg} = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toEqual(data.id);

});

it('calls the ack message', async () => {
    const {listener, ticket, data, msg} = await setup();

    await listener.onMessage(data, msg);

    try {
        expect(msg.ack).toHaveBeenCalled();
    } catch (err) {

    }
});

it('publishes a ticket updated event', async () => {
    const {listener, ticket, data, msg} = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();


    const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

    expect(data.id).toEqual(ticketUpdatedData.orderId);

});