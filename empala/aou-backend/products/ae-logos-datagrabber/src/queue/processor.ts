import { Job } from 'bullmq';
import * as dbService from '../db-service';
import * as aeApi from '../ae-api';
import { logger } from '../lib/logger';
import stat from '../lib/stat';
import { saveToStorage } from '../lib/image';

const getLogosForInstrument = async (instrumentToProcess: InstrumentToProcess): Promise<InstrumentLogosResponse> => {
  const { id, symbol } = instrumentToProcess;
  const logosResponse = await aeApi.fetchLogos(symbol);

  const promises = [
    saveToStorage(id, 'logo', logosResponse.logo),
    saveToStorage(id, 'logo_normal', logosResponse.logo_normal),
    saveToStorage(id, 'logo_original', logosResponse.logo_original),
    saveToStorage(id, 'logo_square', logosResponse.logo_square),
    saveToStorage(id, 'logo_square_strict', logosResponse.logo_square_strict),
    saveToStorage(id, 'logo_thumbnail', logosResponse.logo_thumbnail),
  ];

  const result = (await Promise.all(promises)).reduce((prev, curr) => Object.assign(prev, curr), logosResponse);
  return result;
};

export const processor = async (job: Job) => {
  const instrumentToProcess: InstrumentToProcess = job.data;
  const { symbol, id } = instrumentToProcess;
  logger.silly(`Getting logos for "${symbol}" ...`);

  stat.ping();
  stat.s.apiRequests.logos++;
  const startTime = Date.now();

  const instrumentLogos = await getLogosForInstrument(instrumentToProcess);

  stat.s.cumulativeTimeOfRequests += (Date.now() - startTime);
  await job.updateProgress(50);
  stat.ping();

  logger.silly(`Saving logos for "${symbol}" ...`);

  const logosCount = await dbService.saveLogos(instrumentLogos, id);
  stat.s.logosSaved += logosCount;

  await job.updateProgress(100);
  return { logosCount };
};
