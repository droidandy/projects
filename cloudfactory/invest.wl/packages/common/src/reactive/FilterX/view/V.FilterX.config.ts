import { ILambda } from '../../LambdaX';
import { IDFilterXModelVariant, TDFilterXType } from '../domain/D.FilterX.types';
import { DFilterXArrayModel } from '../domain/model/D.FilterXArray.model';
import { DFilterXBooleanModel } from '../domain/model/D.FilterXBoolean.model';
import { DFilterXComposeDateModel } from '../domain/model/D.FilterXComposeDate.model';
import { DFilterXComposeNumberModel } from '../domain/model/D.FilterXComposeNumber.model';
import { DFilterXComposeStringModel } from '../domain/model/D.FilterXComposeString.model';
import { DFilterXDateModel } from '../domain/model/D.FilterXDate.model';
import { DFilterXNumberModel } from '../domain/model/D.FilterXNumber.model';
import { DFilterXStringModel } from '../domain/model/D.FilterXString.model';
import { VFilterXArrayModel } from './model/V.FilterXArray.model';
import { VFilterXBooleanModel } from './model/V.FilterXBoolean.model';
import { VFilterXComposeDateModel } from './model/V.FilterXComposeDate.model';
import { VFilterXComposeNumberModel } from './model/V.FilterXComposeNumber.model';
import { VFilterXComposeStringModel } from './model/V.FilterXComposeString.model';
import { VFilterXDateModel } from './model/V.FilterXDate.model';
import { VFilterXNumberModel } from './model/V.FilterXNumber.model';
import { VFilterXStringModel } from './model/V.FilterXString.model';
import { IVFilterXConfigModel, IVFilterXModelVariant } from './V.FilterX.types';

export class VFilterXConfig {
  // TODO: fix any
  public static domain2view<T extends TDFilterXType, D extends IDFilterXModelVariant<T>>(model: D): new<T extends TDFilterXType>(d: ILambda<IDFilterXModelVariant<T>>, c?: IVFilterXConfigModel<T>) => IVFilterXModelVariant<T> {
    if (model instanceof DFilterXComposeStringModel) return VFilterXComposeStringModel as any;
    else if (model instanceof DFilterXComposeNumberModel) return VFilterXComposeNumberModel as any;
    else if (model instanceof DFilterXComposeDateModel) return VFilterXComposeDateModel as any;

    else if (model instanceof DFilterXStringModel) return VFilterXStringModel as any;
    else if (model instanceof DFilterXNumberModel) return VFilterXNumberModel as any;
    else if (model instanceof DFilterXDateModel) return VFilterXDateModel as any;
    else if (model instanceof DFilterXBooleanModel) return VFilterXBooleanModel as any;
    else if (model instanceof DFilterXArrayModel) return VFilterXArrayModel as any;
    throw new Error(`Not valid DFilterModel: ${model?.constructor.name}`);
  }
}
