import { AsyncLocalStorage } from 'async_hooks';
import { appendFileSync, PathOrFileDescriptor } from 'fs';

import { Logger as TSLogger, ILogObject } from 'tslog';
import { TLogLevelName } from 'tslog/src/interfaces';

export const asyncLocalStorage: AsyncLocalStorage<{ requestId: string }> = new AsyncLocalStorage();

export const getLogLevel = (logLevel = process.env.LOG_LEVEL, nodeEnv = process.env.NODE_ENV) => logLevel || (nodeEnv === 'production' ? 'error' : 'info');

const getLogger = () => new TSLogger({
  suppressStdOutput: process.env.NODE_ENV === 'test' && !process.env.UNMUTE_LOGGER,
  displayFunctionName: true,
  displayFilePath: 'hideNodeModulesOnly',
  minLevel: getLogLevel() as TLogLevelName,
  requestId: (): string => asyncLocalStorage.getStore()?.requestId,
});

/* istanbul ignore next */
export const logger = getLogger();

const logToFileTransport = (pathOrfile: PathOrFileDescriptor, logObject: ILogObject) => appendFileSync(pathOrfile, `${JSON.stringify(logObject)}\n`);

export const getToFileLogger = (pathOrfile: PathOrFileDescriptor, logLevel: TLogLevelName = 'error') => {
  const toFileLogger = getLogger().getChildLogger({
    suppressStdOutput: true,
  });
  if (process.env.NODE_ENV !== 'test') {
    const currentLogToFileTransport = (logObject: ILogObject) => logToFileTransport(pathOrfile, logObject);
    toFileLogger.attachTransport(
      {
        silly: currentLogToFileTransport,
        debug: currentLogToFileTransport,
        trace: currentLogToFileTransport,
        info: currentLogToFileTransport,
        warn: currentLogToFileTransport,
        error: currentLogToFileTransport,
        fatal: currentLogToFileTransport,
      },
      logLevel,
    );
  }
  return toFileLogger;
};
