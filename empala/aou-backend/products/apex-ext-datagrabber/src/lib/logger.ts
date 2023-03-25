/* istanbul ignore file */
import { AsyncLocalStorage } from 'async_hooks';
import { Logger } from 'tslog';
import { TLogLevelName } from 'tslog/src/interfaces';
import config from 'config';

export const asyncLocalStorage: AsyncLocalStorage<{ requestId: string }> = new AsyncLocalStorage();

class LoggerEx extends Logger {
  public isLevel(levelName: TLogLevelName): boolean {
    // @ts-ignore
    const { _logLevels: logLevels, settings: { minLevel } } = this;
    return logLevels.indexOf(levelName) >= logLevels.indexOf(minLevel);
  }
}

export const logger = new LoggerEx({
  name: 'APEX',
  displayLoggerName: false,
  displayFunctionName: false,
  displayFilePath: 'hidden',
  minLevel: config.get('log.level'),
  requestId: (): string => asyncLocalStorage.getStore()?.requestId,
});

export const exitOnError = (error: Error | any): void => {
  if (!(error instanceof Error)) {
    error = new Error(String(error));
  }
  logger.prettyError(error, true, !error[Symbol.for('noExposeCodeFrame')]);
  process.exit(1);
};
