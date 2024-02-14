import { RabbitMQConnection } from "../rabbitmq/rabbitmq";

export type Message = {
    message: string;
};

export class Consumer {
    public static async consume() {
        const rabbitMQConnection: RabbitMQConnection =
            RabbitMQConnection.create();

        for (;;) {
            await rabbitMQConnection.consume(this.handleMessage);
        }
    }

    private static handleMessage(message: any) {
        if (!message) return;

        try {
            const data = JSON.parse(message.content.toString());
            console.log(`Received message: ${data.message}`);
        } catch (error) {
            console.error("Error parsing message", error);
        }
    }
}
