import {
  IVFilterXModelVariant,
  TDFilterXType,
  VFilterXArrayModel,
  VFilterXBooleanModel,
  VFilterXComposeDateModel,
  VFilterXComposeNumberModel,
  VFilterXComposeStringModel,
  VFilterXDateModel,
  VFilterXNumberModel,
  VFilterXStringModel,
} from '@invest.wl/common';
import React from 'react';
import { VFilterArray } from './component/V.FilterArray.component';
import { VFilterBoolean } from './component/V.FilterBoolean.component';
import { VFilterComposeDate } from './component/V.FilterComposeDate.component';
import { VFilterComposeNumber } from './component/V.FilterComposeNumber.component';
import { VFilterComposeString } from './component/V.FilterComposeString.component';
import { VFilterDate } from './component/V.FilterDate.component';
import { VFilterNumber } from './component/V.FilterNumber.component';
import { VFilterString } from './component/V.FilterString.component';
import { IVFilterProps } from './V.Filter.types';

export class VFilterConfig {
  // TODO: fix any
  public static model2component<T extends TDFilterXType, V extends IVFilterXModelVariant<T>>(model: V): React.ComponentType<IVFilterProps<any>> {
    if (model instanceof VFilterXComposeStringModel) return VFilterComposeString as any;
    else if (model instanceof VFilterXComposeNumberModel) return VFilterComposeNumber as any;
    else if (model instanceof VFilterXComposeDateModel) return VFilterComposeDate as any;

    else if (model instanceof VFilterXStringModel) return VFilterString as any;
    else if (model instanceof VFilterXNumberModel) return VFilterNumber as any;
    else if (model instanceof VFilterXDateModel) return VFilterDate as any;
    else if (model instanceof VFilterXBooleanModel) return VFilterBoolean as any;
    else if (model instanceof VFilterXArrayModel) return VFilterArray as any;
    throw new Error(`Not valid VFilterModel: ${model?.constructor.name}`);
  }
}
