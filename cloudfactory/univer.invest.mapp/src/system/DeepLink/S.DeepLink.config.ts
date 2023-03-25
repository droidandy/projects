import { Injectable } from '@invest.wl/core/src/di/IoC';
import { ISDeepLinkConfig } from '@invest.wl/mobile/src/system/DeepLink/S.DeepLink.types';

@Injectable()
export class SDeepLinkConfig implements ISDeepLinkConfig {
  public scheme = 'investwl://';
}
