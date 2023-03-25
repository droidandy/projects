// TODO: install lib?
// import { allCountries } from 'country-telephone-data';
import { DInputPhoneModel, IDInputModel } from '@invest.wl/domain';
import { computed, makeObservable } from 'mobx';
import { IVInputModelProps, VInputModel } from './V.Input.model';

const allCountries: any[] = [];

const PHONE_MASK_MAP = {
  default: '+[00000000000]',
  1: '+[0] ([000]) [000]-[00]-[00]',
  2: '+[00] ([000]) [000]-[00]-[000]',
  3: '+[000] ([000]) [000]-[00]-[000]',
  4: '+[0] ([000]) [000]-[00]-[00]',
};

const PHONE_MASK_REWRITE_MAP: { [iso: string]: string } = {
  ru: PHONE_MASK_MAP[1],
};

allCountries.forEach(c => {
  if (PHONE_MASK_REWRITE_MAP[c.iso2]) {
    c.format = PHONE_MASK_REWRITE_MAP[c.iso2];
  } else if (c.format) {
    c.format = c.format.replace(/\./g, '9');
  }
});

export class VInputPhoneModel extends VInputModel<IDInputModel> {
  public static addPlus = (value: string = '') => value.length && value[0] !== '+' ? '+' + value : value;
  // public static replaceRU = (value: string = '') =>
  //   value.startsWith('+89') ? value.replace('+89', '+79') : value;
  public static replaceRUOnInput = (value: string = '', valuePrev: string = '') => value?.length > 2 ? value : '+7';

  // ✅ Not observable
  private _prevValueCache: string = '';

  constructor(model: IDInputModel, props?: IVInputModelProps) {
    super(model, props);
    makeObservable(this);
    this.domain.errorsSet(() => this.domain.errorsValidator ?? DInputPhoneModel.validate(this.domain.value, DInputPhoneModel.sanitize(this.phoneMask).length));
    if (!props?.valueSetSkip) {
      this.domain.valueSet(() => this.valueInput ? DInputPhoneModel.sanitize(this.valueInput) : undefined);
      this.valueSet(() => this._formattedPhone);
    }
  }

  // Подбор маски для ввода телефона, по первым введенным символам
  @computed
  public get phoneMask(): string {
    const phone = this.domain.value ?? '';

    if (phone.length > 1) {
      let newMask = PHONE_MASK_MAP.default;
      for (let i = Math.min(phone.length - 1, 4); i >= 1; i--) {
        const code = phone.slice(0, i);
        const finded = allCountries.find(c => c.dialCode === code && parseInt(c.priority, 10) === 0 && c.format);
        if (finded) {
          newMask = finded.format || (PHONE_MASK_MAP as any)[i];
          break;
        }
      }
      return newMask;
    }
    return PHONE_MASK_MAP[1];
  }

  @computed
  private get _formattedPhone() {
    // _prevValue должен всегда находиться в observable
    const value = VInputPhoneModel.addPlus(this.domain.value);
    return VInputPhoneModel.replaceRUOnInput(value, this._prevValue);
  }

  @computed
  public get maskOptions() {
    return { mask: this.phoneMask };
  }

  // Сохранение предыдущего значения ввода, используется для вычисления предзаполнения маски
  @computed
  private get _prevValue() {
    const result = this._prevValueCache;
    this._prevValueCache = this.valueInput || '';
    return result;
  }
}
