import { Stan } from 'node-nats-streaming';
import { Event } from "../interfaces/Event";
import { logger } from "../helper/logger";

export abstract class Publisher<T extends Event> {
  abstract subject: T['subject'];
  private client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  publish(data: T['data']): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) {
          return reject(err);
        }
        logger.info(`Event published to subject ${this.subject}`);
        resolve();
      });
    });
  }
}
