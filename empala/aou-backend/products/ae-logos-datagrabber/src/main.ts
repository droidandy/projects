import { exitOnError, logger } from './lib/logger';
import stat from './lib/stat';
import * as worker from './queue/worker';
import * as dbService from './db-service';
import * as completionWatcher from './completion-watcher';
import { addBulkJobs } from './queue/add-job';

const getInstrumentsToProcess = async (): Promise<InstrumentToProcess[]> => {
  logger.debug('Receiving lists of instruments...');

  stat.ping();
  const instrumentsFromDb = await dbService.getInstrumentListFromDb();
  const total = instrumentsFromDb.length;
  stat.ping();

  logger.info('Received lists of instruments from DB');

  stat.setTotal(total);

  return instrumentsFromDb;
};

const fillQueue = async (instrumentsToProcess: InstrumentToProcess[]): Promise<void> => {
  if (instrumentsToProcess.length) {
    await addBulkJobs(instrumentsToProcess);
    logger.info(`Added ${instrumentsToProcess.length} instruments to the queue for loading logos.`);
  } else {
    logger.info('No instruments for which to get logos');
  }
};

/**
 * Microservice launch
 */
export const main = async (): Promise<number> => {
  try {
    const { name } = await worker.init();
    logger.info(`Initialized Worker [${name}]`);
    const instrumentsToProcesses = await getInstrumentsToProcess();
    await fillQueue(instrumentsToProcesses);
    // After filling the queue, workers take over the job
  } catch (err) {
    exitOnError(err);
    return -3;
  }

  // We launch an observer that will terminate the microservice either after emptying the queues,
  // or when serious errors occur
  const completeState = await completionWatcher.watch();
  return completeState;
};
