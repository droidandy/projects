/* eslint-disable no-await-in-loop */
/*
This observer monitors queues and terminates the process in the following cases:
- when the queues are cleared
- when the idle timer expires
- when a serious error occurs
 */

import * as _ from 'lodash';
import { logger } from './lib/logger';
import { Color } from './lib/color';
import { AEApiRequestQueue } from './queue/queue';
import stat from './lib/stat';
import { sleep } from './lib/lib';

const { bold } = Color;

const checkState = async (): Promise<number> => {
  let countersOfQueues = await AEApiRequestQueue.getJobCounts('wait', 'completed', 'failed', 'delayed', 'active', 'paused', 'repeat');
  countersOfQueues = _.pickBy(countersOfQueues, (v) => v);
  logger.silly(`\tSignificant queues: ${JSON.stringify(countersOfQueues)}`);

  if (_.isEmpty(countersOfQueues)) {
    return 0;
  }

  if (stat.isIdleTimeExceeded()) {
    return -1;
  }

  if (Object.keys(countersOfQueues).length === 1 && countersOfQueues.failed) {
    return -2;
  }

  stat.estimate(_.reduce(countersOfQueues, (previous, current) => previous + current, 0));
  return 1;
};

export const watch = async (): Promise<number> => {
  let completeState = 1;
  while (completeState === 1) {
    await sleep(3000);
    completeState = await checkState();
  }
  stat.print();
  if (completeState === 0) {
    logger.info(`${bold}Completed loading of logos`);
  } else if (completeState === -1) {
    logger.warn(`${bold}Microservice stopped after ${stat.idleSec()}s of inactivity`);
  } else {
    logger.error(`${bold}Microservice finished but with some failures`);
  }
  return completeState;
};
