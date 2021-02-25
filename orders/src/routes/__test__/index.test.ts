import request from "supertest";
import mongoose from "mongoose";

import {app} from "../../app";
import {Ticket} from "../../models/ticket";
import {Order, OrderStatus} from "../../models/order";


const buildTicket = async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concet',
        price: 20
    });
    await ticket.save();
    return ticket;
}


it('has a route handler listening to /api/orders for get request', async () => {
    const response = await request(app)
        .get('/api/orders')
        .send({});

    expect(response.status).not.toEqual(404);
});

it('fetches orders for an particular user', async () => {

    //create 3 tickets
    const ticket1 = await buildTicket();
    const ticket2 = await buildTicket();
    const ticket3 = await buildTicket();

    const userOne = global.signin();
    const userTwo = global.signin();
    // create 1 order as user #1
    await request(app)
        .post('/api/orders')
        .set('Cookie', userOne)
        .send({
            ticketId: ticket1.id
        }).expect(201);

    //create 2 order as user #2
    const {body: orderOne} = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({
            ticketId: ticket2.id
        }).expect(201);
    const {body: orderTwo} = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({
            ticketId: ticket3.id
        }).expect(201);
    //make request to get order fro user #2

    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', userTwo)
        .expect(200);

    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(orderOne.id);
    expect(response.body[1].id).toEqual(orderTwo.id);
    expect(response.body[0].ticket.id).toEqual(ticket2.id);
    expect(response.body[1].ticket.id).toEqual(ticket3.id);

});

