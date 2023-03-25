export enum ESLoggerLevel {
  TRACE,
  DEBUG,
  INFO,
  LOG,
  WARN,
  ERROR,
  OFF,
}

export interface ISLoggerConfig {
  level: ESLoggerLevel;
}

export const SLoggerServiceTid = Symbol.for('SLoggerServiceTid');

export interface ISLoggerService {
  write(level: ESLoggerLevel, message: string, eventType?: string, eventData?: any): void;
  trace(message: string, eventType?: string, eventData?: any): void;
  debug(message: string, eventType?: string, eventData?: any): void;
  info(message: string, eventType?: string, eventData?: any): void;
  log(message: string, eventType?: string, eventData?: any): void;
  warn(message: string, eventType?: string, eventData?: any): void;
  error(message: string, eventType?: string, eventData?: any): void;
}
