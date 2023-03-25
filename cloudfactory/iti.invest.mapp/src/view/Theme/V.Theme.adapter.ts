import { Injectable } from '@invest.wl/core/src/di/IoC';
import { IVThemeModel, IVThemeAdapter } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VThemeDefaultVariant, VThemeTestVariant } from './variant';

@Injectable()
export class VThemeAdapter implements IVThemeAdapter {
  public list: IVThemeModel[] = [VThemeDefaultVariant, VThemeTestVariant];
}
