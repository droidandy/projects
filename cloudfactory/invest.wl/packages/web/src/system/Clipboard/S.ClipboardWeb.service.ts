import { Inject, Injectable } from '@invest.wl/core/src/di/IoC';
import { ISErrorService, SErrorServiceTid } from '@invest.wl/system/src/Error/S.Error.types';
import { ISClipboardService } from '@invest.wl/system/src/Clipboard/S.Clipboard.types';

@Injectable()
export class SClipboardWebService implements ISClipboardService {
  constructor(
    @Inject(SErrorServiceTid) private _errorService: ISErrorService,
  ) {}

  public stringGet(): Promise<string> {
    return navigator.clipboard.readText()
      .catch((e: any) => {throw this._errorService.systemHandle(e); });
  }

  public async stringSet(value: string) {
    return navigator.permissions.query({ name: 'clipboard-write' })
      .then(result => {
        if (result.state == 'granted' || result.state == 'prompt') {
          navigator.clipboard.writeText(value);
        }
      })
      .catch((e: any) => {throw this._errorService.systemHandle(e); });
  }
}

