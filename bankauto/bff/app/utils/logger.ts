import { Logger } from 'tslog';
import { TLogLevelName } from 'tslog/src/interfaces';

class LoggerEx extends Logger {
  public isLevel(levelName: TLogLevelName): boolean {
    // @ts-ignore
    const {
      _logLevels: logLevels,
      settings: { minLevel },
    } = this;
    return logLevels.indexOf(levelName) >= logLevels.indexOf(minLevel);
  }
}

export const logger = new LoggerEx({
  name: 'BFF',
  displayLoggerName: false,
  displayFunctionName: false,
  displayFilePath: 'hidden',
});
