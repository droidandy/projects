import { Job, Worker } from 'bullmq';
import config from 'config';
import { logger } from '../lib/logger';
import { Color } from '../lib/color';
import stat from '../lib/stat';
import { connection, AEApiRequestQueue } from './queue';
import { processor } from './processor';

const { cleanOnStart } = config.get('bullmq');
const REQUESTS_PER_SECOND = Number(config.get('requestsPerSecond'));
const LIMITER_DURATION = 1_100; // 1s + slightly more.

const { red, cyan, reset } = Color;

export const init = async () => {
  if (cleanOnStart) {
    logger.info('Cleaning the queue at start');
    await AEApiRequestQueue.obliterate({ force: true }).then((r) => r);
    logger.info('Queue cleaned');
  }

  const worker = new Worker(AEApiRequestQueue.name, processor, {
    connection, // Redis connection config (the same as in the queue settings)
    concurrency: 1, // Number of simultaneously processed requests
    limiter: {
      max: REQUESTS_PER_SECOND, // no more than <REQUESTS_PER_SECOND> queries in 1 s
      duration: LIMITER_DURATION,
    },
  });

  worker.on('completed', (job) => {
    const { logosCount } = job.returnvalue || {};
    const { symbol } = job.data;
    const msg = logosCount ? `Loaded ${logosCount} logos for "${cyan}${symbol}"` : `No data of logos for "${cyan}${symbol}"`;
    logger.debug(msg);
  });

  worker.on('failed', (job: Job | any, failedReason: Error | any) => {
    stat.s.queue.failedAttempts++;
    const { id, data: { symbol } } = job;
    logger.warn(`Work # ${id} failed for ${cyan}${symbol}${reset}. Reason: ${red}${failedReason}`);
    job.response = undefined;
  });

  return worker;
};
