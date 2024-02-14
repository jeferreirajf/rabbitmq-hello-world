# RabbitMQ Hello World

This is a simple example of a RabbitMQ producer and consumer.

## Running the example

To run this application, you need to have Docker installed. Then, you can run the following command:

```
docker compose up -d --build
```

This will start the RabbitMQ server and both producer and consumer applications. Each application will run in its own container. The producer will send a message to the RabbitMQ server and the consumer will consume it. All the messages will be printed in the console.

## How to see the messages

You can see the messages being produced and consumed by the applications by running the following command:

```
docker compose logs producer consumer
```

## Acessing the RabbitMQ management interface

You can access the RabbitMQ management interface by opening the following URL in your browser:

```
http://localhost:15672
```

The credentials are:

- **Username**: someuser
- **Password**: somepassword