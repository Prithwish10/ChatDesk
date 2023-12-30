import { Redis } from "ioredis";
import { SocketEventPublisher } from "../../interfaces/v1/SocketEventPublisher";

export class SucketEventPublisherImpl implements SocketEventPublisher {
  private publisher: Redis;

  constructor(publisher: Redis) {
    this.publisher = publisher;
  }

  publish(channel: string, data: string): void {
    this.publisher.publish(channel, data);
  }
}
