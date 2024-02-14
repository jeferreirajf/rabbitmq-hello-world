import { RabbitMQConnection } from "../rabbitmq/rabbitmq";

export class Producer {
    public static async produce() {
        const rabbimq = RabbitMQConnection.create();

        let i = 0;

        for (;;) {
            const data = { message: `Hello World! ${++i}` };
            console.log(`Sending message: ${data.message}`);
            rabbimq.sendMessage(data);
            await this.timeOut(5);
        }
    }

    public static async timeOut(seconds: number) {
        return new Promise((resolve) => {
            setTimeout(resolve, seconds * 1000);
        });
    }
}
