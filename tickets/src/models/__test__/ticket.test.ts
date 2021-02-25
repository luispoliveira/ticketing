import {Ticket} from "../ticket";

it('implements optimistic concurrency control', async (done) => {
    //create an instance of a ticket
    const ticket = Ticket.build({
        title: 'test',
        price: 5,
        userId: '123'
    })
    //save the ticket ot the database
    await ticket.save();
    //fetch the ticket twice
    const ticketOne = await Ticket.findById(ticket.id);
    const ticketTwo = await Ticket.findById(ticket.id);
    //make two separate changes to the tickets we fetched
    ticketOne!.set({price: 10});
    ticketTwo!.set({price: 20});
    //save the first fetch ticket
    await ticketOne!.save();
    // save the second ticket and expect an error

    try {
        await ticketTwo!.save();
    } catch (err) {
        return done();
    }
    throw new Error('Should not reach this point');
});

it('increments the version number on multiple saves', async () => {
    const ticket = Ticket.build({
        title: 'test',
        price: 5,
        userId: '123'
    })
    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);
})