import nats, { Stan } from 'node-nats-streaming';
import { logger } from './logger';
import { Api500Error } from '@pdchat/common';

class NatsWrapper {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Api500Error('Cannot access NATS client before connecting');
    }
    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise<void>((resolve, reject) => {
      this.client.on('connect', () => {
        logger.info('🛡️  Connected to NATS 🛡️');
        resolve();
      });

      this.client.on('error', (error) => {
        reject(error);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
