import { IoC, ISErrorSystemDTO } from '@invest.wl/core';
import { ESErrorSystemCode, ISErrorConfig, ISErrorSystemModel, SErrorConfigTid } from '../S.Error.types';
import { SErrorModel } from './S.Error.model';

type TDTO = ISErrorSystemDTO;

export class SErrorSystemModel<DTO extends TDTO = TDTO> extends SErrorModel<DTO> implements ISErrorSystemModel<TDTO> {
  private _cfg = IoC.get<ISErrorConfig>(SErrorConfigTid);

  public get message() {
    if (this.dto.code != null && this._cfg.systemCode2Message[this.dto.code]) return this._cfg.systemCode2Message[this.dto.code];
    return super.message;
  }

  public get signoutNeed() {
    return this.dto.code === ESErrorSystemCode.NoRefreshToken;
  }

  public refreshNeed = false;
}
