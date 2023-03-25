import { computed, makeObservable } from 'mobx';
import { Formatter } from '../../../../util/formatter.util';
import { ILambda } from '../../../LambdaX';
import { IDFilterXComposeModel } from '../../domain/D.FilterX.types';
import { IVFilterXConfigModel } from '../V.FilterX.types';
import { VFilterXComposeModel } from './V.FilterXCompose.model';

export class VFilterXComposeDateModel extends VFilterXComposeModel<Date> {
  @computed
  public get display() {
    const { from, to } = this.domain;
    if (!from?.dto || !to?.dto) return undefined;
    return `${Formatter.date(from.dto, { pattern: 'default' })
    } - ${Formatter.date(to.dto, { pattern: 'default' })}`;
  }

  constructor(dtoLV: ILambda<IDFilterXComposeModel<Date>>, config: IVFilterXConfigModel<Date>) {
    super(dtoLV, config);
    makeObservable(this);
  }
}
