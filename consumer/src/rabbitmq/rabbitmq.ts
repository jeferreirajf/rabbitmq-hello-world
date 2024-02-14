export type MessageHandler = (message: any) => void;

import client, { Channel, Connection } from "amqplib";

export class RabbitMQConnection {
    private RABBITMQ_USER = "someuser";
    private RABBITMQ_PASSWORD = "somepassword";
    private RABBITMQ_HOST = process.env.RABBITMQ_HOST || "localhost";
    private RABBITMQ_PORT = 5672;

    private RABBITMQ_EXCHANGE_NAME = "hello-world-exchange";
    private RABBITMQ_QUEUE_NAME = "hello-world-queue";

    private connection!: Connection;
    private channel!: Channel;

    private connected: boolean;

    private constructor() {
        this.connected = false;
    }

    public static create() {
        return new RabbitMQConnection();
    }

    private async connect() {
        if (this.connected && this.channel) return;

        try {
            this.connection = await client.connect(
                `amqp://${this.RABBITMQ_USER}:${this.RABBITMQ_PASSWORD}@${this.RABBITMQ_HOST}:${this.RABBITMQ_PORT}`
            );

            this.channel = await this.connection.createChannel();            

        } catch (error) {
            console.error("Error connecting to RabbitMQ", error);
        }
    }

    public async consume(aHandler: MessageHandler) {
        await this.connect();

        const assertQueueResult = await this.channel.assertQueue(this.RABBITMQ_QUEUE_NAME, {
            durable: false,
        });

        await this.channel.bindQueue(
            assertQueueResult.queue,
            this.RABBITMQ_EXCHANGE_NAME,
            ""
        );

        this.channel.consume(
            assertQueueResult.queue,
            aHandler,
            {
                noAck: true,
            }
        );
    }

    private async close() {
        if (this.connected) {
            await this.channel.close();
            await this.connection.close();
        }
    }
}
