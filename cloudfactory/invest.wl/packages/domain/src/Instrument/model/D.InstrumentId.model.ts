import { IDInstrumentId, IInstrumentIdBase, IInstrumentIdBaseOther, TModelId } from '@invest.wl/core';

export class DInstrumentId implements IDInstrumentId {
  public static USD = new DInstrumentId({
    id: '3', classCode: 'CETS', secureCode: 'USD000UTSTOM',
  });

  public static EUR = new DInstrumentId({
    id: '7', classCode: 'CETS', secureCode: 'EUR_RUB__TOM',
  });

  public static fromInstrumentName(instrumentName: string) {
    switch (instrumentName) {
      case 'USD':
        return DInstrumentId.USD;
      case 'EUR':
        return DInstrumentId.EUR;
      default:
        return null;
    }
  }

  public id: TModelId;
  public classCode?: string;
  public secureCode?: string;

  public get isFull() {
    return !!(this.id && this.classCode && this.secureCode);
  }

  constructor(base: IInstrumentIdBase) {
    this.id = base.id;
    this.classCode = base.classCode;
    this.secureCode = base.secureCode;
  }

  public equals(cid?: IInstrumentIdBase) {
    return !!cid && this.id === cid.id && this.classCode === cid.classCode && this.secureCode === cid.secureCode;
  }

  public toString(separator?: string) {
    return [this.id, this.classCode, this.secureCode].join(separator);
  }

  public toJSON(other: boolean): IInstrumentIdBaseOther;
  public toJSON(): IInstrumentIdBase;
  public toJSON(other?: boolean) {
    const base = {
      classCode: this.classCode,
      secureCode: this.secureCode,
    };
    return other
      ? { instrumentId: this.id, ...base } as IInstrumentIdBaseOther
      : { id: this.id, ...base } as IInstrumentIdBase;
  }
}


