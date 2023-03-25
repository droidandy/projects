/*
The class is intended for collecting statistics when the microservice is running
and displaying statistics before shutting down.
 */
import config from 'config';
import dayjs from 'dayjs';
import { logger } from './logger';

export class Stat {
  public readonly s: {
    instruments: {
      presentInDbOnStart: number;
      newFromMS: number;
      toLoadPrices: number;
      excludedAsFromAnotherExchange: string[];
      enrichedCount: number;
      notEnrichedDueToLackOfShortDescription: string[];
      otherSecurityTypes: string[];
      notPresentInEnrichmentAnswer: string[];
    };
    deletedAsEmpty: number;
    apiRequests: {
      symbolGuide: number;
      instrumentsInfo: number;
      prices: number;
      avgTimeOfPricesRequestsMs: number;
    };
    queue: {
      failedAttempts: number;
    };
    dailyBarsSaved: number;
    maxMemUsedMB: number;
    timeSpentOnMicroserviceWork: string;
    cumulativeTimeOfPricesRequests: number;
  };

  private readonly instance: Stat;

  private lastActivity: number;

  private readonly idleTimeLimitSec: number;

  private readonly startTs: number;

  public constructor() {
    if (this.instance) {
      // eslint-disable-next-line no-constructor-return
      return this.instance;
    }
    this.idleTimeLimitSec = Number(config.get('idleTimeLimitSec')) || 350;
    this.startTs = Date.now();
    this.s = {
      instruments: {
        presentInDbOnStart: 0,
        newFromMS: 0,
        toLoadPrices: 0,
        excludedAsFromAnotherExchange: [],
        enrichedCount: 0,
        notEnrichedDueToLackOfShortDescription: [],
        otherSecurityTypes: [],
        notPresentInEnrichmentAnswer: [],
      },
      deletedAsEmpty: 0,
      apiRequests: {
        symbolGuide: 0,
        instrumentsInfo: 0,
        prices: 0,
        avgTimeOfPricesRequestsMs: 0,
      },
      queue: {
        failedAttempts: 0,
      },
      dailyBarsSaved: 0,
      maxMemUsedMB: 0,
      timeSpentOnMicroserviceWork: '0',
      cumulativeTimeOfPricesRequests: 0,
    };
    this.ping();
  }

  public static duration(ms: number): string {
    return dayjs.duration(ms, 'ms').format(ms > 3600_000 ? 'HH[h] mm[m]' : 'mm[m] ss[s]');
  }

  public idleSec(): number {
    return Math.floor((Date.now() - this.lastActivity) / 1000);
  }

  public isIdleTimeExceeded(): boolean {
    return this.idleTimeLimitSec < this.idleSec();
  }

  public ping(): void {
    this.lastActivity = Date.now();
  }

  public mem(): number {
    const usedMb = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
    this.s.maxMemUsedMB = Math.max(this.s.maxMemUsedMB, usedMb);
    return usedMb;
  }

  public estimate(remain: number): void {
    const { toLoadPrices: total } = this.s.instruments;
    const processed = total - remain;
    const percent = Math.ceil((processed / total) * 100);
    let left = '???';
    if (processed) {
      const msLeft = (Date.now() - this.startTs) * ((total / processed) - 1);
      left = Stat.duration(msLeft);
    }
    logger.info(`Completed ${percent}%. ${left} left. Memory used: ${this.mem()} MB / max: ${this.s.maxMemUsedMB} MB`);
  }

  public print(): void {
    this.s.timeSpentOnMicroserviceWork = Stat.duration(Date.now() - this.startTs);
    this.s.apiRequests.avgTimeOfPricesRequestsMs = Math.round(this.s.cumulativeTimeOfPricesRequests / (this.s.apiRequests.prices || 1));
    const info = { ...this.s };
    delete info.cumulativeTimeOfPricesRequests;

    logger.info(`
=============================================
                Statistics:
=============================================
${JSON.stringify(info, undefined, 4)}`);
  }
}

const stat = new Stat();

export default stat;
