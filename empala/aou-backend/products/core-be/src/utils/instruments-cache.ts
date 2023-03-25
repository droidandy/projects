import { Mutex } from 'async-mutex';
import { Instrument } from '../models/instrument';
import { INSTRUMENT_CACHE_LOADING_BATCH_SIZE, INSTRUMENT_CACHE_RELOAD_UTC_TIME } from '../constants';
import { BidirectionalMap } from './bidirectional-map';

const mutex = new Mutex();

class InstrumentsCache extends BidirectionalMap<BigInt | string, string> {
  public ONE_DAY_MILLIS = 86_400_000;

  private nextReloadTime: number;

  private readonly cacheReloadTime: number[];

  public constructor() {
    super(false);
    this.cacheReloadTime = INSTRUMENT_CACHE_RELOAD_UTC_TIME.split(':').map((v) => parseInt(v, 10)); // [hours, minutes]
  }

  public setNextReloadTime(nextReloadTime?: number): void {
    if (nextReloadTime == null) {
      const [hours, minutes] = this.cacheReloadTime;
      nextReloadTime = Number((new Date()).setUTCHours(hours, minutes, 0, 0));
      /* istanbul ignore if */
      if (Date.now() >= nextReloadTime) {
        nextReloadTime += this.ONE_DAY_MILLIS;
      }
    }
    this.nextReloadTime = nextReloadTime;
  }

  public forceExpire() {
    this.nextReloadTime = 0;
  }

  public getNextReloadTime(): number {
    return this.nextReloadTime;
  }

  public isCacheExpire(): boolean {
    /* istanbul ignore next */
    return (this.nextReloadTime || 0) < Date.now();
  }

  /**
   * @param batchSize If 0 - then the list of instruments is loaded with one request
   */
  public async reloadInstrumentsCache(batchSize: number = INSTRUMENT_CACHE_LOADING_BATCH_SIZE): Promise<void> {
    if (mutex.isLocked()) {
      await mutex.waitForUnlock();
    } else {
      await mutex.runExclusive(async () => {
        await this.reloadCache(batchSize);
      });
    }
    this.setNextReloadTime();
  }

  public async getInstIdBySymbol(symbol: string): Promise<BigInt | string | undefined> {
    await this.reloadCacheIfNeed();
    return this.getKey1(symbol);
  }

  public async getSymbolByInstId(instId: BigInt | string): Promise<string | undefined> {
    await this.reloadCacheIfNeed();
    return this.getKey2(instId);
  }

  /**
   * @param batchSize If 0 - then the list of instruments is loaded with one request
   */
  private async reloadCache(batchSize: number = INSTRUMENT_CACHE_LOADING_BATCH_SIZE): Promise<void> {
    if (batchSize) {
      let offset = 0;
      let hasNext = true;
      while (hasNext) {
        // eslint-disable-next-line no-await-in-loop
        const instruments: Instrument[] = await Instrument.createQueryBuilder()
          .orderBy('id', 'ASC')
          .offset(offset)
          .limit(batchSize)
          .getMany();
        hasNext = instruments.length === batchSize;
        offset += batchSize;
        this.cacheInstruments(instruments);
      }
    } else {
      const instruments: Instrument[] = await Instrument.find();
      this.cacheInstruments(instruments);
    }
    this.setNextReloadTime();
  }

  private cacheInstruments(instruments: Instrument[]): void {
    // eslint-disable-next-line no-restricted-syntax
    for (const { id, symbol } of instruments) {
      this.set(id, symbol);
    }
  }

  private async reloadCacheIfNeed(): Promise<void> {
    if (!this.size || this.isCacheExpire()) {
      this.clear();
      await this.reloadInstrumentsCache();
    }
  }
}

let instance: InstrumentsCache;

const getInstrumentsCache = () => {
  if (!instance) {
    instance = new InstrumentsCache();
  }
  return instance;
};

const instrumentsCache = getInstrumentsCache();

export default instrumentsCache;
