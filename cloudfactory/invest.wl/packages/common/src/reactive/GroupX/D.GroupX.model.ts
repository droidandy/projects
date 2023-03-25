import { computed, makeObservable } from 'mobx';
import { ILambda, LambdaX } from '../LambdaX';
import { MapX } from '../MapX/MapX';
import { DModelX } from '../ModelX/D.ModelX.model';
import { IDModelX } from '../ModelX/ModelX.types';
import { IDGroupXItem, IDGroupXModel, IDGroupXProps } from './GroupX.types';

export class DGroupXModel<M extends IDModelX<any>, O extends string | number, D extends Record<string, any>, G extends IDModelX<any>>
  extends DModelX<IDGroupXProps<M, O, D, G>> implements IDGroupXModel<M, O, D, G> {
  constructor(dto: ILambda<IDGroupXProps<M, O, D, G>>) {
    super(dto);
    makeObservable(this);
  }

  @computed
  public get index() {
    return this.dto.index ?? 0;
  }

  @computed
  public get order() {
    return LambdaX.resolve(this.dto.order);
  }

  @computed
  public get list() {
    return LambdaX.resolve(this.dto.list);
  }

  @computed
  public get by() {
    return this.order[this.index];
  }

  public innerX = this._needInner ? new MapX.DList(this.dto.source,
    () => this._innerProps, this.dto.groupFabric) : undefined;

  public innerAllX = this._needInner ? new MapX.D(this.dto.source,
    () => this._innerPropsAll, this.dto.groupFabric) : undefined;

  @computed
  private get _needInner() {
    return this.index < (this.order.length - 1);
  }

  @computed
  private get _innerProps() {
    const orderNext = this.order[this.index + 1];
    if (orderNext == null) return undefined;
    return this.dto.groupPropsFabric(orderNext).map(f => ({
      id: f.id, list: f.list, data: this.dto.data,
      order: this.order, index: this.index + 1,
    } as IDGroupXItem<M, O, D>));
  }

  @computed
  private get _innerPropsAll() {
    return {
      id: '-1', list: this.list, data: this.dto.data,
      order: this.order, index: this.index + 1,
    } as IDGroupXItem<M, O, D>;
  }
}
