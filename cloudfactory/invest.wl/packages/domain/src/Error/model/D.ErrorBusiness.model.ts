import { IDErrorDTO, Injectable, IoC } from '@invest.wl/core';
import { DErrorConfig, DErrorConfigTid } from '../D.Error.config';
import { DErrorModel, IDErrorModel } from './D.Error.model';

export const DErrorBusinessModelTid = Symbol.for('DErrorBusinessModelTid');
type TDTO = IDErrorDTO;

export interface IDErrorBusinessModel<DTO extends TDTO = TDTO> extends IDErrorModel<DTO> {

}

@Injectable()
export class DErrorBusinessModel<DTO extends TDTO = TDTO> extends DErrorModel<DTO> implements IDErrorBusinessModel<DTO> {
  private _const = IoC.get<DErrorConfig>(DErrorConfigTid);

  public get message() {
    if (this.dto.code && this._const.businessCode2Message[this.dto.code]) return this._const.businessCode2Message[this.dto.code];
    return super.message;
  }
}
