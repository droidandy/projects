import { Inject, Injectable } from '@invest.wl/core';
import { ISErrorService, SErrorServiceTid } from '../Error/S.Error.types';
import { ISNetworkEndpointConfigurator, ISNetworkEndpointMap, ISNetworkEndpointProvider } from './S.Network.types';

@Injectable()
export class SNetworkEndpointProvider implements ISNetworkEndpointProvider, ISNetworkEndpointConfigurator {
  private _map?: ISNetworkEndpointMap;

  public get isConfigured() {
    return !!this._map && Object.keys(this._map).length > 1;
  }

  constructor(
    @Inject(SErrorServiceTid) private _errorService: ISErrorService,
  ) {}

  public configure(map: ISNetworkEndpointMap) {
    this._map = { ...map };
  }

  public provide(uid: string) {
    if (!this._map) throw this._errorService.systemHandle('SNetworkEndpointProvider: Must configure first');
    const ep = this._map[uid];
    if (!ep) throw this._errorService.systemHandle(`SNetworkEndpointProvider: Not found endpoint with uid: ${uid}`);
    return ep;
  }
}
