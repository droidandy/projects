import { computed, makeObservable, observable } from 'mobx';
import { IDInputModel, IDInputModelProps } from '../D.Input.types';
import { DInputValidator } from '../D.Input.validator';
import { DInputModel } from './D.Input.model';

// ввод ИНН

const CONTROL_WEIGHTS_10 = [2, 4, 10, 3, 5, 9, 4, 6, 8];
const CONTROL_WEIGHTS_11 = [7, 2, 4, 10, 3, 5, 9, 4, 6, 8];
const CONTROL_WEIGHTS_12 = [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8];

export enum EDInputInnType {
  // Физ лицо
  Personal = 'personal',
  // Юр лицо
  Legal = 'legal',
}

export interface IDInputInnModel extends IDInputModel {
  readonly type?: EDInputInnType;
  readonly isPersonalProbably: boolean;
}

export interface IDInputInnModelProps extends IDInputModelProps {
  type?: EDInputInnType;
}

export class DInputInnModel extends DInputModel implements IDInputInnModel {
  public static len = {
    [EDInputInnType.Personal]: 12,
    [EDInputInnType.Legal]: 10,
  };

  public static validation = {
    [EDInputInnType.Legal](value?: string) {
      if (!value) return;
      const test1 = /\d{10}/.test(value);

      const digits = value.split('').map(d => parseInt(d, 10));
      const dgt10 = CONTROL_WEIGHTS_10.reduce((s, w, i) => s + w * digits[i], 0) % 11 % 10;
      const test2 = dgt10 === digits[9];

      return test1 && test2 ? undefined : 'Введите корректный ИНН';
    },
    [EDInputInnType.Personal](value?: string) {
      if (!value) return;
      const test1 = /\d{12}/.test(value);

      const digits = value.split('').map(d => parseInt(d, 10));
      const dgt11 = CONTROL_WEIGHTS_11.reduce((s, w, i) => s + w * digits[i], 0) % 11 % 10;
      const dgt12 = CONTROL_WEIGHTS_12.reduce((s, w, i) => s + w * digits[i], 0) % 11 % 10;
      const test2 = dgt11 === digits[10] && dgt12 === digits[11];

      return test1 && test2 ? undefined : 'Введите корректный ИНН';
    },
  };

  @observable public type?: EDInputInnType;

  constructor(props?: IDInputInnModelProps) {
    super(props);
    this.type = props?.type;
    this.errorsSet(() => {
      const typeErrors = this.type
        ? DInputValidator.lengthEq(this.value, DInputInnModel.len[this.type]) ?? DInputInnModel.validation[this.type](this.value)
        : (
          DInputValidator.lengthMin(this.value, DInputInnModel.len[EDInputInnType.Legal])
          ?? DInputValidator.lengthMax(this.value, DInputInnModel.len[EDInputInnType.Personal])
          ?? this.isPersonalProbably ? DInputInnModel.validation.personal(this.value) : DInputInnModel.validation.legal(this.value)
        );

      return this.errorsValidator ?? typeErrors;
    });
    makeObservable(this);
  }

  @computed
  public get isPersonalProbably() {
    return !!this.value && this.value.length > 10;
  }
}
