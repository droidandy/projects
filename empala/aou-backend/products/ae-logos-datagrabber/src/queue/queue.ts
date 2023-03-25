import { Queue, QueueScheduler } from 'bullmq';
import config from 'config';
import { logger } from '../lib/logger';

export const QUEUE_NAME = 'AE_LOGOS_REQUEST_QUEUE';
export const connection = config.get('bullmq.redis');

export const queueScheduler = new QueueScheduler(QUEUE_NAME, { connection });

const { attempts, backoff } = config.get('bullmq');

export const AEApiRequestQueue = new Queue(
  QUEUE_NAME,
  {
    connection,
    defaultJobOptions: {
      attempts: Number(attempts), // We use 8
      backoff: {
        type: backoff.type, // "fixed" | "exponential". // We use "exponential"
        delay: Number(backoff.delay), // We use 5000 ms
        // attempts will be at 0s, 5s, 10s, 20s, 40s, 80s, 160s, 320s
      },
      removeOnComplete: true,
      removeOnFail: false,
    },
  },
);

logger.info(`Initialized BullMQ [${QUEUE_NAME}]`);
