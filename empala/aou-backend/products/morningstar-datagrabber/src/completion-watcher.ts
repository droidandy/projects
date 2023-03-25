/* eslint-disable no-await-in-loop */
/*
This observer monitors queues and terminates the process in the following cases:
- when the queues are cleared
- when the idle timer expires
- when a serious error occurs
 */

import * as _ from 'lodash';
import { logger } from './lib/logger';
// eslint-disable-next-line import/no-named-as-default
import EColor from './lib/color';
import { MSApiRequestQueue } from './queue/queue';
import stat from './lib/stat';
import { sleep } from './lib/lib';

const { bold } = EColor;

const checkState = async (): Promise<number> => {
  let countersOfQueues = await MSApiRequestQueue.getJobCounts('wait', 'completed', 'failed', 'delayed', 'active', 'paused', 'repeat');
  countersOfQueues = _.pickBy(countersOfQueues, (v) => v);
  logger.silly(`\tSignificant queues: ${JSON.stringify(countersOfQueues)}`);

  if (_.isEmpty(countersOfQueues)) {
    return 1;
  }

  if (stat.isIdleTimeExceeded()) {
    return -1;
  }

  if (countersOfQueues.failed) {
    const failedJobs = await MSApiRequestQueue.getFailed();
    const isUltimatelyFailedJob = failedJobs.some((job) => job.attemptsMade >= job.opts.attempts);
    if (isUltimatelyFailedJob) {
      return -2;
    }
  }

  stat.estimate(_.reduce(countersOfQueues, (previous, current) => previous + current, 0));
  return 0;
};

export const watch = async (): Promise<number> => {
  let completeState = 0;
  while (completeState === 0) {
    await sleep(3000);
    completeState = await checkState();
  }
  stat.print();
  if (completeState === 1) {
    logger.info(`${bold}Completed loading of daily bars`);
  } else if (completeState === -1) {
    logger.warn(`${bold}Microservice stopped after ${stat.idleSec()}s of inactivity`);
  } else {
    logger.error(`${bold}Microservice stopped due to one job was not completed in a set number of attempts`);
  }
  return completeState;
};
