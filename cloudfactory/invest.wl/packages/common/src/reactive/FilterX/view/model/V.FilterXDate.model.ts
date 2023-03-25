import { computed, makeObservable } from 'mobx';
import { Formatter } from '../../../../util/formatter.util';
import { ILambda } from '../../../LambdaX';
import { DFilterXModel } from '../../domain/model/D.FilterX.model';
import { IVFilterXConfigModel } from '../V.FilterX.types';
import { VFilterXModel } from './V.FilterX.model';

export class VFilterXDateModel extends VFilterXModel<Date> {
  @computed
  public get display() {
    if (this.domain.isEmpty) return undefined;
    return `${this.domain.operator} ${Formatter.date(this.domain.dto!, {
      pattern: 'default',
    })}`;
  }

  constructor(dtoLV: ILambda<DFilterXModel<Date>>, config: IVFilterXConfigModel<Date>) {
    super(dtoLV, config);
    makeObservable(this);
  }
}
