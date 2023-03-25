import { ILambda, INumberXLimiter, lambdaResolve, NumberX, TNumberXDelimiter } from '@invest.wl/common';
import { IDInputNumberModel } from '@invest.wl/domain';
import { action, computed, makeObservable, observable } from 'mobx';
import { IVInputModelProps, VInputModel } from './V.Input.model';

/**
 * Поле ввода числового значения.
 */

export class VInputNumberModel extends VInputModel<IDInputNumberModel, string | number> {
  public numberX = new NumberX(() => this.valueInput, () => this._numberXOpts);

  @observable.ref private _delimiters?: TNumberXDelimiter[];
  @observable private _thousand?: boolean | string | undefined;
  private _limiterOpts?: ILambda<INumberXLimiter> = () => ({
    min: this.domain.min,
    max: this.domain.max,
    precision: this.domain.precision,
  });

  constructor(model: IDInputNumberModel, props?: IVInputModelProps) {
    super(model, { pattern: NumberX.reClearSource, ...props });
    makeObservable(this);
    if (!props?.valueSetSkip) {
      this.domain.valueSet(() => this.numberX.value);
      this.valueSet(() => this.numberX.sync(this.domain.value));
    }

    // ❌ @action.bound не использовать! Если использовать, то косячит вызов в дочерних классах через super
    this.setLimiter = this.setLimiter.bind(this);
    this.setThousand = this.setThousand.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  @action
  public setLimiter(value: ILambda<INumberXLimiter> | boolean = true) {
    if (value === false) {
      this._limiterOpts = undefined;
    } else if (value === true) {
      this._limiterOpts = () => ({
        min: this.domain.min,
        max: this.domain.max,
        precision: this.domain.precision,
      });
    } else {
      this._limiterOpts = value;
    }
    return this;
  }

  @computed
  public get delimiters() {
    return this._delimiters;
  }

  @computed
  public get thousand() {
    return this._thousand;
  }

  @action
  public setDelimiters(delimiters?: TNumberXDelimiter[]) {
    this._delimiters = delimiters;
    return this;
  }

  @action
  public setThousand(thousand?: boolean | string | undefined) {
    this._thousand = thousand;
    return this;
  }

  @computed
  private get _numberXOpts() {
    return {
      delimiters: this.delimiters || [',', '.'],
      limiter: lambdaResolve(this._limiterOpts),
      format: {
        thousand: this.thousand === false ? '' : (this.thousand === true ? undefined : this.thousand),
      },
    };
  }
}
