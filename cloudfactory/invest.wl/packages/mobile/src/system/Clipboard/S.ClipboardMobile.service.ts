import { Inject, Injectable } from '@invest.wl/core';
import { ISClipboardService, ISErrorService, SErrorServiceTid } from '@invest.wl/system';
import Clipboard from '@react-native-clipboard/clipboard';

@Injectable()
export class SClipboardMobileService implements ISClipboardService {
  constructor(
    @Inject(SErrorServiceTid) private _errorService: ISErrorService,
  ) {}

  public stringGet(): Promise<string> {
    return Clipboard.getString()
      .catch((e: any) => {throw this._errorService.systemHandle(e); });
  }

  public async stringSet(value: string) {
    try {
      return Clipboard.setString(value);
    } catch (e: any) {
      throw this._errorService.systemHandle(e);
    }
  }
}
