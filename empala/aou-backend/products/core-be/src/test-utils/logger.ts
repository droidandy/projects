import { ILogObject, Logger as TSLogger } from 'tslog';
import { logger as utilsLogger } from '../../../utils/src/logger';

export const logger = new TSLogger({
  displayFunctionName: true,
  displayFilePath: 'hideNodeModulesOnly',
  minLevel: 'debug',
});

export class LogCapture {
  public static logs: ILogObject[] = [];

  private static isLogCaptureEnabled = false;

  private static isTransportAttached = false;

  public static enableLogCapture(): void {
    if (this.isLogCaptureEnabled) return;

    if (!this.isTransportAttached) {
      const logHandler = (logObject: ILogObject): void => {
        if (this.isLogCaptureEnabled) this.logs.push(logObject);
      };

      utilsLogger.attachTransport({
        silly: logHandler,
        debug: logHandler,
        trace: logHandler,
        info: logHandler,
        warn: logHandler,
        error: logHandler,
        fatal: logHandler,
      });
      this.isTransportAttached = true;
    }
    this.isLogCaptureEnabled = true;
  }

  public static clear(): void {
    this.logs.length = 0;
  }

  public static disableLogCapture(): void {
    this.isLogCaptureEnabled = false;
    this.clear();
  }

  public static hasLogEntry(msg: string): boolean {
    return this.logs.some((item) => item.argumentsArray[0].toString().includes(msg));
  }
}
