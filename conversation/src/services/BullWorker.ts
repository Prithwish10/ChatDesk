import { Job, Worker } from 'bullmq';

export class ConversationBullWorker {
  constructor() {
    this.initiate();
  }

  initiate() {
    new Worker(
      'conversation-queue',
      async (job: Job) => {
        await this.processConversationEvent(job.data);
      },
      { connection: { host: process.env.REDIS_HOST } },
    );
  }

  async processConversationEvent(data: any) {
    try {

    } catch(error) {
        
    }
  }
}
