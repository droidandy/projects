import { Inject, Injectable } from '@invest.wl/core';
import { DAnalyticsServiceAdapterTid, IDAnalyticsServiceAdapter } from './D.Analytics.types';

@Injectable()
export class DAnalyticsService {
  constructor(
    @Inject(DAnalyticsServiceAdapterTid) private _service: IDAnalyticsServiceAdapter,
  ) { }

  public eventSend(event: string, payload: Record<string, any>) {
    return this._service.eventSend(event, payload);
  }
}
