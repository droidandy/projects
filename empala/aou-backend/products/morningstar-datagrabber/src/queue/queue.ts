import { Queue, QueueScheduler } from 'bullmq';
import config from 'config';
import { logger } from '../lib/logger';

export const QUEUE_NAME = 'MORNING_STAR_REQUEST_QUEUE';
export const connection = config.get('bullmq.redis');

// eslint-disable-next-line no-new
new QueueScheduler(QUEUE_NAME, { connection });

const { attempts, backoff } = config.get('bullmq');

export const MSApiRequestQueue = new Queue(
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
