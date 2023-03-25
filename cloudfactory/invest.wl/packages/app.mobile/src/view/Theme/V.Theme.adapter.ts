import { Injectable } from '@invest.wl/core';
import { IVThemeAdapter, IVThemeModel } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VThemeDefaultVariant, VThemeTestVariant } from './variant';

@Injectable()
export class VThemeAdapter implements IVThemeAdapter {
  public list: IVThemeModel[] = [VThemeDefaultVariant, VThemeTestVariant];
}
