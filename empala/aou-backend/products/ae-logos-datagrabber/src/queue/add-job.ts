import { JobsOptions } from 'bullmq/dist/interfaces/jobs-options';
import { AEApiRequestQueue } from './queue';

export const getJobOptions = (instrumentToProcess: InstrumentToProcess): JobsOptions => ({
  // Set the "ID" of the instrument as the jobId. This will prevent the same instrument from being
  // added to the queue again. See: https://docs.bullmq.io/patterns/debounce-jobs
  jobId: String(instrumentToProcess.id),
  priority: 1,
});

export const addBulkJobs = async (instrumentsToProcess: InstrumentToProcess[]) => {
  AEApiRequestQueue.addBulk(instrumentsToProcess.map((data: InstrumentToProcess) => ({
    name: AEApiRequestQueue.name,
    data,
    opts: getJobOptions(data),
  })));
};
