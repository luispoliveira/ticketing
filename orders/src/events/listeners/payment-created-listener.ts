import {Listener, OrderStatus, PaymentCreatedEvent, Subjects} from "@lpotickets/common";
import {queueGroupName} from "./queue-group-name";
import {Message} from "node-nats-streaming";
import {Order} from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    async onMessage(data: PaymentCreatedEvent["data"], msg: Message): Promise<void> {

        const order = await Order.findById(data.orderId);

        if (!order) {
            throw new Error('Order not found');
        }

        order.set({
            status: OrderStatus.Complete
        });
        await order.save();




        msg.ack();

    }

    queueGroupName: string = queueGroupName;
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;

}