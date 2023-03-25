import { Request, Response } from 'express';
import morgan from 'morgan';
import { IncomingMessage } from 'http';

interface FormattingErrorType extends Error {
  name: string;
  info: string;
  data?: any;
  format: {};
  stack_inner: string;
}

class FormattingError extends Error implements FormattingErrorType {
  data: any;

  info: string;

  stack_inner: string;

  constructor(error?: Error | string, message?: string) {
    super(error instanceof Error ? error.message : error);
    Error.captureStackTrace(this, FormattingError);
    if (error instanceof Error) {
      this.data = error;
    }
    this.name = this.constructor.name;
    this.info = message || '';
    this.stack_inner = '';
    return this;
  }

  get config() {
    return this.data && this.data.config;
  }

  get request() {
    return this.data && this.data.request;
  }

  get response() {
    return this.data && this.data.response;
  }

  private get formatBase() {
    return {
      name: this.name,
      level: 'error',
      message: this.message,
      info: this.info,
    };
  }

  private get formatStack() {
    const re = '.*(?=node_modules)';
    const sep = ' - ';
    const stack: string[] =
      (this.data.stack && this.data.stack.split('\n')) || (this.stack && this.stack.split('\n')) || [];

    return {
      stack: stack.join(sep),
      stack_inner: stack.filter((e) => !e.match(re)).join(sep),
    };
  }

  get format() {
    if (this.response) {
      return {
        ...this.formatBase,
        url: this.config && this.config.url,
        method: this.config && this.config.method,
        request_id: this.config && this.config.headers['X-Request-Id'],
        status: this.response && this.response.status,
        data: this.response && !(this.response.data instanceof IncomingMessage) && this.response.data,
      };
    }
    return this.formatBase;
  }

  get formatFull() {
    return {
      ...this.format,
      ...this.formatStack,
    };
  }

  get formatJson() {
    return JSON.stringify(this.format);
  }

  get formatFullJson() {
    return JSON.stringify(this.formatFull);
  }
}

export const FormatError = (error?: Error | string, message?: string): void => {
  const e = error instanceof FormattingError ? error : new FormattingError(error, message);
  console.log(e.formatFullJson);
};

export const ErrorHandling = (err: any, req: Request, res: Response, next: any) => {
  const e = err instanceof FormattingError ? err : new FormattingError(err, 'Handle by router');
  console.log(e.formatFullJson);
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.response?.status || 500);
  const { stack, stack_inner, ...stackLess } = e.formatFull;
  res.json(err.response?.data || { error: stackLess });
};

type Logger = (...args: any[]) => void;

interface LogProvider {
  log: Logger;
  debug?: Logger;
  info?: Logger;
  warn?: Logger;
  error?: Logger;
}

export class BaseLogger implements LogProvider {
  format(level: string, ...args: any[]) {
    console.log(JSON.stringify({ name: 'LogProvider', level: level, message: args }));
  }

  log(...args: any[]) {
    this.format('log', ...args);
  }

  debug(...args: any[]) {
    this.format('debug', ...args);
  }

  info(...args: any[]) {
    this.format('info', ...args);
  }

  warn(...args: any[]) {
    this.format('warn', ...args);
  }

  error(...args: any[]) {
    this.format('error', ...args);
  }
}

export const MorganLogger = morgan((tokens, req, res) =>
  JSON.stringify({
    url: tokens.url(req, res),
    method: tokens.method(req, res),
    status: tokens.status(req, res),
    request_id: tokens.req(req, res, 'X-Request-Id'),
  }),
);
