/* istanbul ignore file */
/*
The class is intended for collecting statistics when the microservice is running
and displaying statistics before shutting down.
 */
import humanizeDuration from 'humanize-duration';
import { DateTime } from 'luxon';
import { logger } from './logger';
import * as utils from './utils';

export class Stat {
  public firstError: any;

  public readonly s: {
    expectedReportDate: string;
    SODFiles: {
      total: number;
      datesToDownload: { [fileDate: ISODateString]: string };
      cumulativeDownloadTimeMs: number;
      avgDownloadTimeMs: number;
      avgTimeOfOneFileProcessMs: number;
    };
    instruments: {
      wasInFeed: number;
      upserted: number;
      new: number;
    };
    closingPricesSaved: number;
    maxMemUsedMB: number;
    warnings: string[];
    errors: string[];
    timeSpentOnMicroserviceWork: string;
    startTime: string;
    endTime: string;
  };

  private readonly instance: Stat;

  private readonly startTs: number;

  private readonly DT_FORMAT: string = 'MMM dd HH:mm:ss Z';

  private readonly initialData: string;

  public constructor() {
    /* istanbul ignore if */
    if (this.instance) {
      // eslint-disable-next-line no-constructor-return
      return this.instance;
    }
    this.startTs = Date.now();
    this.s = {
      expectedReportDate: '',
      SODFiles: {
        total: 0,
        datesToDownload: {},
        cumulativeDownloadTimeMs: 0,
        avgDownloadTimeMs: 0,
        avgTimeOfOneFileProcessMs: 0,
      },
      instruments: {
        wasInFeed: 0,
        upserted: 0,
        new: 0,
      },
      closingPricesSaved: 0,
      maxMemUsedMB: 0,
      warnings: [],
      errors: [],
      timeSpentOnMicroserviceWork: '0',
      startTime: DateTime.fromMillis(this.startTs).toFormat(this.DT_FORMAT),
      endTime: '',
    };
    this.initialData = JSON.stringify(this.s);
    this.ping();
  }

  public static duration(ms: number): string {
    /* istanbul ignore next */
    return humanizeDuration(ms, { units: ms > 3600_000 ? ['h', 'm'] : ['m', 's'], round: true });
  }

  public reset(): void {
    Object.assign(this.s, JSON.parse(this.initialData));
  }

  public mem(): number {
    const usedMb = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
    this.s.maxMemUsedMB = Math.max(this.s.maxMemUsedMB, usedMb);
    return usedMb;
  }

  public ping(): void {
    this.mem();
  }

  public addError(err: any, severity = 0): string {
    utils.truncateVariablesInErrorMessage(err);
    const message = String(err?.message ?? err);
    const msg = message.substring(0, 400);
    if (severity || err?.severity) {
      if (!this.firstError) {
        this.firstError = err;
      }
      this.s.errors.push(msg);
    } else {
      this.s.warnings.push(msg);
    }
    logger.warn(message);
    return msg;
  }

  /* istanbul ignore next */
  public print(): void {
    const totalDurationMs = Date.now() - this.startTs;
    this.s.timeSpentOnMicroserviceWork = Stat.duration(totalDurationMs);

    this.s.SODFiles.avgTimeOfOneFileProcessMs = Math.round(totalDurationMs / (this.s.SODFiles.total || 1));

    this.s.SODFiles.avgDownloadTimeMs = Math.round(this.s.SODFiles.cumulativeDownloadTimeMs / (this.s.SODFiles.total || 1));

    const info = { ...this.s };
    if (!info.warnings.length) {
      delete info.warnings;
    }
    if (!info.errors.length) {
      delete info.errors;
    }
    delete info.SODFiles.cumulativeDownloadTimeMs;
    info.endTime = DateTime.now().toFormat(this.DT_FORMAT);
    logger.info(`
=============================================
                Statistics:
=============================================
${JSON.stringify(info, undefined, 4)}`);
  }
}

const stat = new Stat();

export default stat;
