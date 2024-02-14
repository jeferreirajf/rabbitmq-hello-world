import client, { Channel, Connection } from "amqplib";

export class RabbitMQConnection {
    private RABBITMQ_USER = "someuser";
    private RABBITMQ_PASSWORD = "somepassword";
    private RABBITMQ_HOST = process.env.RABBITMQ_HOST || "localhost";
    private RABBITMQ_PORT = 5672;

    private RABBITMQ_EXCHANGE_NAME = "hello-world-exchange";

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

            this.channel.assertExchange(this.RABBITMQ_EXCHANGE_NAME, "fanout", {
                durable: false,
            });
        } catch (error) {
            console.error("Error connecting to RabbitMQ", error);
        }
    }

    public async sendMessage(message: any) {
        await this.connect();

        try {
            const dataMessage = JSON.stringify(message);

            this.channel.publish(
                this.RABBITMQ_EXCHANGE_NAME,
                "",
                Buffer.from(dataMessage)
            );
        } catch (error) {
            console.error("Error sending message to exchange", error);
        }

        await this.close();
    }

    private async close() {
        if (this.connected) {
            await this.channel.close();
            await this.connection.close();
        }
    }
}
