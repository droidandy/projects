/*
The class is intended for collecting statistics when the microservice is running
and displaying statistics before shutting down.
 */
import config from 'config';
import { Duration } from 'luxon';
import { logger } from './logger';

export class Stat {
  public readonly s: {
    instruments: {
      total: number;
    };
    apiRequests: {
      images: number;
      logos: number;
      avgTimeOfPricesRequestsMs: number;
    };
    queue: {
      failedAttempts: number;
    };
    logosSaved: number;
    maxMemUsedMB: number;
    timeSpentOnMicroserviceWork: string;
    cumulativeTimeOfRequests: number;
  };

  private readonly instance: Stat;

  private lastActivity: number;

  private readonly idleTimeLimitSec: number;

  private readonly startTs: number;

  public constructor() {
    if (this.instance) {
      return;
    }
    this.idleTimeLimitSec = Number(config.get('idleTimeLimitSec')) || 350;
    this.startTs = Date.now();
    this.s = {
      instruments: {
        total: 0,
      },
      apiRequests: {
        images: 0,
        logos: 0,
        avgTimeOfPricesRequestsMs: 0,
      },
      queue: {
        failedAttempts: 0,
      },
      logosSaved: 0,
      maxMemUsedMB: 0,
      timeSpentOnMicroserviceWork: '0',
      cumulativeTimeOfRequests: 0,
    };
    this.ping();
  }

  public static duration(ms: number): string {
    return Duration.fromMillis(ms).toFormat(ms > 3600_000 ? 'hh\'h\' mm\'m\'' : 'mm\'m\' ss\'s\'');
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

  public setTotal(total: number): void {
    this.s.instruments.total = total;
  }

  public mem(): number {
    const usedMb = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
    this.s.maxMemUsedMB = Math.max(this.s.maxMemUsedMB, usedMb);
    return usedMb;
  }

  public estimate(remain: number): void {
    const { total } = this.s.instruments;
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
    this.s.apiRequests.avgTimeOfPricesRequestsMs = Math.round(this.s.cumulativeTimeOfRequests / (this.s.apiRequests.logos || 1));
    const info = { ...this.s };
    delete info.cumulativeTimeOfRequests;
    logger.info(`
=============================================
                Statistics:
=============================================
${JSON.stringify(info, undefined, 4)}`);
  }
}

const stat = new Stat();

export default stat;
