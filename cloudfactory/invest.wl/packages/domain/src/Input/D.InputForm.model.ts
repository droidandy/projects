import { TModelDTO } from '@invest.wl/common';
import { action, computed, makeObservable, observable } from 'mobx';
import { IDInputFormFields, IDInputFormModel } from './D.Input.types';
import { DInputModel } from './model/D.Input.model';

// TODO: fix any
export class DInputFormModel<DTO extends TModelDTO> implements IDInputFormModel<DTO> {
  public static isValid<DTO extends TModelDTO>(fields: IDInputFormFields<DTO>): boolean {
    return Object.values(fields).every(f => f instanceof DInputModel
      ? f.isValid : Array.isArray(f)
        ? f.every(i => i instanceof DInputModel ? i.isValid : DInputFormModel.isValid(i as IDInputFormFields<TModelDTO>))
        : DInputFormModel.isValid(f as IDInputFormFields<TModelDTO>),
    );
  }

  public static toDTO<DTO extends TModelDTO>(fields: IDInputFormFields<DTO>): DTO {
    return Object.keys(fields).reduce((res, k) => {
      const key = k as keyof DTO;
      const v = fields[key];
      if (v instanceof DInputModel) {
        res[key] = v.value;
      } else if (Array.isArray(v)) {
        res[key] = v.map(i => i instanceof DInputModel ? i.value : DInputFormModel.toDTO(i as any)) as any;
      } else {
        res[key] = DInputFormModel.toDTO(v as IDInputFormFields<any>);
      }
      return res;
    }, {} as DTO);
  }

  @observable public fields: IDInputFormFields<DTO>;

  @computed
  public get isValid() {
    return DInputFormModel.isValid(this.fields);
  }

  @computed
  public get asDTO() {
    return DInputFormModel.toDTO(this.fields) as DTO;
  }

  constructor(fields: IDInputFormFields<DTO>) {
    makeObservable(this);
    this.fields = fields;
  }

  @action.bound
  public fromDTO(dto?: DTO) {
    this._fromDTO(this.fields, dto);
    return this;
  }

  @action
  public clear() {
    this._fromDTO(this.fields);
    return this;
  }

  private _fromDTO(fields: IDInputFormFields<DTO>, dto?: DTO) {
    Object.keys(fields).forEach((k) => {
      const key = k as keyof DTO;
      const fieldV = fields[key];
      const dtoV = dto?.[key];
      if (fieldV instanceof DInputModel) {
        fieldV.valueSet(dtoV);
      } else if (Array.isArray(fieldV)) {
        const dtoArray = Array.isArray(dtoV) ? dtoV : [] as any[];
        fieldV.forEach((item, index) => item instanceof DInputModel
          ? item.valueSet(dtoArray[index]) : this._fromDTO(item as any, dtoArray[index]));
      } else if (typeof fieldV === 'object') {
        this._fromDTO(fieldV as any, dtoV);
      }
    });
  }
}
