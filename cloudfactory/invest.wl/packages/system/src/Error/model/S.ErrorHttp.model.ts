import { IoC, ISErrorHttpDTO } from '@invest.wl/core';
import { computed } from 'mobx';
import { ISNetworkEndpointProvider, SNetworkEndpointProviderTid } from '../../Network/S.Network.types';
import { ISErrorConfig, ISErrorHttpModel, SErrorConfigTid } from '../S.Error.types';
import { SErrorModel } from './S.Error.model';

type TDTO = ISErrorHttpDTO;

export class SErrorHttpModel<DTO extends TDTO = TDTO> extends SErrorModel<ISErrorHttpDTO> implements ISErrorHttpModel<TDTO> {
  private _cfg = IoC.get<ISErrorConfig>(SErrorConfigTid);
  private _ep = IoC.get<ISNetworkEndpointProvider>(SNetworkEndpointProviderTid);

  public get message() {
    if (this.dto.status != null && this._cfg.httpCode2Message[this.dto.status]?.(this.dto)) {
      const msg = this._cfg.httpCode2Message[this.dto.status](this.dto);
      if (msg) return msg;
    }
    if (this.dto.message && this._cfg.httpMessage2Message[this.dto.message]) return this._cfg.httpMessage2Message[this.dto.message];
    return this.isTechnical ? 'Ошибка обновления данных' : this.isNetwork ? 'Отсутствует соединение с интернетом' :
      this.isUnauthorized ? 'Сессия завершена. Для продолжения работы войдите повторно в приложение.'
        : this.isAccess ? 'Недостаточно прав' : super.message;
  }

  public set message(value: string) {
    this._message = value;
  }

  @computed
  public get isNetwork() {
    return (this.dto.httpStatus === undefined && this.dto.body == null) ||
      (this.dto.httpStatus === -1 && this.dto.body === undefined) ||
      this.dto.httpStatus === 504;
  }

  @computed
  public get isBusiness() {
    return this.dto.httpStatus === 500;
  }

  @computed
  public get isTechnical() {
    return (this.dto.httpStatus > 200 && this.dto.status < 300) || [400, 404].includes(this.dto.httpStatus);
  }

  @computed
  public get isUnauthorized() {
    // игнорируем ошибки авторизации от сервиса dadata, чтобы избежать бесконечное обновление refreshToken
    if (this.dto.url.includes('dadata.ru')) return false;
    // TODO: договориться с бэком чтобы в случае НЕВЕРНОГО \ ПРОТУХШЕГО токена присылал ИМЕННО 401
    return [401, 403].includes(this.dto.httpStatus);
  }

  @computed
  public get isAccess() {
    // TODO: договориться с бэком чтобы в случае АКТУАЛЬНОГО токена НО когда юзер не имеет прав присылал ИМЕННО 403
    return this.dto.httpStatus === 403;
  }

  @computed
  public get signoutNeed() {
    // 60003 - RefreshToken expired
    const isRefreshError = this.dto.url === this._ep.provide('refresh')?.url;
    return isRefreshError || (typeof this.dto.status === 'number'
      ? [60003].includes(this.dto.status)
      : (this.dto.status === 'invalid_grant' && (this.dto.message === 'Invalid refresh token' || this.dto.message === 'Token is not active')));
  }

  @computed
  public get refreshNeed() {
    return false;
  }


  public toJSON() {
    return {
      ...super.toJSON(),
      body: this.dto.body,
      status: this.dto.status,
      httpStatus: this.dto.httpStatus,
    };
  }
}
