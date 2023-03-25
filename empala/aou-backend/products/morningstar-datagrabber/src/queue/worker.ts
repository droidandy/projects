import { Job, Worker } from 'bullmq';
import config from 'config';
import { logger } from '../lib/logger';
// eslint-disable-next-line import/no-named-as-default
import EColor from '../lib/color';
import stat from '../lib/stat';
import { connection, MSApiRequestQueue } from './queue';
import { processor } from './processor';

const { concurrency, cleanOnStart } = config.get('bullmq');
const REQUESTS_PER_SECOND = Number(config.get('morningStar.quotas.requestsPerSecond'));
const LIMITER_DURATION = 1_100; // 1s + slightly more.

const { red, cyan, reset } = EColor;

export const init = async () => {
  if (cleanOnStart) {
    logger.info('Cleaning the queue at start');
    await MSApiRequestQueue.obliterate({ force: true }).then((r) => r);
    logger.info('Queue cleaned');
  }

  const worker = new Worker(MSApiRequestQueue.name, processor, {
    connection, // Redis connection config (the same as in the queue settings)
    concurrency, // Number of simultaneously processed requests
    limiter: {
      max: REQUESTS_PER_SECOND, // no more than <REQUESTS_PER_SECOND> queries in 1 s
      duration: LIMITER_DURATION,
    },
  });

  worker.on('completed', (job) => {
    const { barsCount } = job.returnvalue || {};
    const { instrument, sdate, edate } = job.data;
    const msg = `${barsCount ? `Loaded ${barsCount}` : 'No data of'
    } daily bars for "${cyan}${instrument}"${reset} for ${sdate} - ${edate}`;
    logger.debug(msg);
  });

  worker.on('failed', (job: Job | any, failedReason: Error | any) => {
    stat.s.queue.failedAttempts++;
    const { message, response } = failedReason;
    const { id, data: { instrument } } = job;
    const msg = `Work # ${id} failed for ${cyan}${instrument}${reset}. Reason:`;
    if (logger.isLevel('silly')) {
      logger.warn(msg);
      logger.prettyError(failedReason);
    } else {
      logger.warn(`${msg} ${red}${message}`);
    }
    job.response = response;
  });

  return worker;
};
