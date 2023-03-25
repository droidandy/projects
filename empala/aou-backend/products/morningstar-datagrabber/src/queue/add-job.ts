import { JobsOptions } from 'bullmq/dist/interfaces/jobs-options';
import { MSApiRequestQueue } from './queue';

export const getJobOptions = (instrumentToProcess: InstrumentToProcess): JobsOptions => ({
  // Set the "ID" of the instrument as the jobId. This will prevent the same instrument from being
  // added to the queue again. See: https://docs.bullmq.io/patterns/debounce-jobs
  jobId: instrumentToProcess.instrument,
  priority: 1,
});

export const addBulkJobs = async (instrumentsToProcess: InstrumentToProcess[]) => MSApiRequestQueue
  .addBulk(instrumentsToProcess.map((data: InstrumentToProcess) => ({
    name: MSApiRequestQueue.name,
    data,
    opts: getJobOptions(data),
  })));
