import nats from 'node-nats-streaming';
import { UserCreatedPublisher } from './events/user-created-publisher';

console.clear();

const stan = nats.connect('chat', 'abc', {
  url: 'http://localhost:4222',
});

stan.on("connect", async () => {
  console.log("Publisher connected to NATS");

  const publisher = new UserCreatedPublisher(stan);
  try {
    await publisher.publish({
      id: "123",
      firstName: "Demo",
      lastName: "test",
      email: "test@gmail.com",
      mobileNumber: "1234567890"
    });
  } catch (err) {
    console.error(err);
  }
});
