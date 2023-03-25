import { computed, makeObservable } from 'mobx';
import { Formatter } from '../../../../util/formatter.util';
import { ILambda } from '../../../LambdaX';
import { IDFilterXComposeModel } from '../../domain/D.FilterX.types';
import { IVFilterXConfigModel } from '../V.FilterX.types';
import { VFilterXComposeModel } from './V.FilterXCompose.model';

export class VFilterXComposeNumberModel extends VFilterXComposeModel<number> {
  @computed
  public get display() {
    const { from, to } = this.domain;
    if (!from?.dto || !to?.dto) return undefined;
    return `${Formatter.number(from.dto)} - ${Formatter.number(to.dto)}`;
  }

  constructor(dtoLV: ILambda<IDFilterXComposeModel<number>>, config: IVFilterXConfigModel<number>) {
    super(dtoLV, config);
    makeObservable(this);
  }
}
