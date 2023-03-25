import { Injectable } from '@invest.wl/core';
import { ISDeepLinkConfig } from '@invest.wl/mobile';

@Injectable()
export class SDeepLinkConfig implements ISDeepLinkConfig {
  public scheme = 'investwl://';
}
