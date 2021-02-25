import {Listener, OrderCreatedEvent, Subjects} from "@lpotickets/common";
import {Message} from "node-nats-streaming";
import {queueGroupName} from "./queue-group-name";
import {expirationQueue} from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {


    async onMessage(data: OrderCreatedEvent["data"], msg: Message): Promise<void> {

        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        console.log('Waiting this miliseconds to process the job:', delay);


        await expirationQueue.add({
                orderId: data.id
            },
            {
                delay: delay
            }
        );


        msg.ack();
    }

    queueGroupName: string = queueGroupName;
    subject: Subjects.OrderCreated = Subjects.OrderCreated;

}