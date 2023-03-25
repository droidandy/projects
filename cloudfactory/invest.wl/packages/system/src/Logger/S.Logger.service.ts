import { Inject, Injectable } from '@invest.wl/core';
import { ISConfigStore, SConfigStoreTid } from '../Config/S.Config.types';
import { ESLoggerLevel, ISLoggerConfig, ISLoggerService } from './S.Logger.types';

@Injectable()
export class SLoggerService implements ISLoggerService {
  private _config!: ISLoggerConfig;

  // private _serverLog: LoggerService;

  constructor(@Inject(SConfigStoreTid) _const: ISConfigStore) {
    this._config = _const.loggerConfig;

    // this._serverLog = new LoggerService({
    //   serverLogLevel: _const.LoggerConfig.serverLogLevel as number,
    //   serverLogUrl: _const.LoggerConfig.serverLogUrl,
    // });
  }

  public write(level: ESLoggerLevel, message: string, eventType?: string, eventData?: any) {
    if (eventType === undefined) {
      eventType = 'NA';
    }

    // const now = new Date().toISOString();
    // this._serverLog.write0(now, level as number, message, eventType, eventData);

    if (level >= this._config.level) {
      const args = [`[${ESLoggerLevel[level]}] ${eventType}`, message];
      if (eventData) {
        args.push(eventData);
      }
      switch (level) {
        case ESLoggerLevel.WARN:
          console.warn(...args); // 🐞 ✅
          break;
        case ESLoggerLevel.ERROR:
          console.error(...args); // 🐞 ✅
          break;
        case ESLoggerLevel.INFO:
          console.info(...args); // 🐞 ✅
          break;
        default:
          console.log(...args); // 🐞 ✅
      }
    }
  }

  public trace(message: string, eventType?: string, eventData?: any) {
    this.write(ESLoggerLevel.TRACE, message, eventType, eventData);
  }

  public debug(message: string, eventType?: string, eventData?: any) {
    this.write(ESLoggerLevel.DEBUG, message, eventType, eventData);
  }

  public info(message: string, eventType?: string, eventData?: any) {
    this.write(ESLoggerLevel.INFO, message, eventType, eventData);
  }

  public log(message: string, eventType?: string, eventData?: any) {
    this.write(ESLoggerLevel.LOG, message, eventType, eventData);
  }

  public warn(message: string, eventType?: string, eventData?: any) {
    this.write(ESLoggerLevel.WARN, message, eventType, eventData);
  }

  public error(message: string, eventType?: string, eventData?: any) {
    this.write(ESLoggerLevel.ERROR, message, eventType, eventData);
  }
}
