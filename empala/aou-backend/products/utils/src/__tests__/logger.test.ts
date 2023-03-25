import { logger, getLogLevel } from '../logger';

describe('Logger', () => {
  it('has logging functions', () => {
    expect(logger.error).toBeDefined();
    expect(logger.warn).toBeDefined();
    expect(logger.debug).toBeDefined();
    expect(logger.info).toBeDefined();
    expect(logger.trace).toBeDefined();
    expect(logger.fatal).toBeDefined();
  });

  it('returns correct LogLevel', () => {
    expect(getLogLevel('warn', 'production')).toEqual('warn');
    expect(getLogLevel(null, 'production')).toEqual('error');
    expect(getLogLevel(null, 'development')).toEqual('info');
  });
});
