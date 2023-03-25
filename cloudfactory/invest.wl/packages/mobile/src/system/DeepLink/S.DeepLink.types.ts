export const SDeepLinkConfigTid = Symbol.for('SDeepLinkConfigTid');

export interface ISDeepLinkConfig {
  scheme: string;
}

export interface IDeepLinkHandleOpts {
  url?: string;
  reset?: boolean;
  frontAction?: string;
}

export interface IDeepLinkService {
  readonly deeplinkUrl?: string;

  init(): Promise<void>;
  handle(opts?: IDeepLinkHandleOpts): Promise<any>;
}
