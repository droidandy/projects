import { AsynX } from '@invest.wl/common';
import { IDAuthExternalUrlRequestDTO, Inject, Injectable } from '@invest.wl/core';
import { action, makeObservable, observable } from 'mobx';
import URLParse from 'url-parse';
import { DErrorService, DErrorServiceTid } from '../../Error/D.Error.service';
import { DAuthGateway } from '../D.Auth.gateway';
import { DAuthService } from '../D.Auth.service';
import { DAuthGatewayTid, DAuthServiceTid } from '../D.Auth.types';

export interface IDAuthExternalCaseProps extends Pick<IDAuthExternalUrlRequestDTO, 'type'> {
}

export const DAuthExternalCaseTid = Symbol.for('DAuthExternalCaseTid');

@Injectable()
export class DAuthExternalCase {
  @observable.ref public props?: IDAuthExternalCaseProps;

  public url = new AsynX(this._gw.externalUrl.bind(this._gw), {
    name: 'VAuthExternalCase.url', req: () => this.props ? { type: this.props.type } : undefined,
  });

  public urlSuccess = new AsynX(this._gw.externalUrlSuccess.bind(this._gw), {
    name: 'VAuthExternalCase.urlSuccess', req: () => this.props ? { type: this.props.type } : undefined,
  });

  constructor(
    @Inject(DAuthServiceTid) private _service: DAuthService,
    @Inject(DAuthGatewayTid) private _gw: DAuthGateway,
    @Inject(DErrorServiceTid) private _errorService: DErrorService,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IDAuthExternalCaseProps) {
    this.props = props;
  }

  public check(url: Omit<URLParse, 'set'>) {
    const urlSuccess = this.urlSuccess.data?.url;
    if (!urlSuccess) throw this._errorService.businessHandle('No external success url loaded');
    return url.href.indexOf(urlSuccess) !== -1 && !!url.query.code;
  };

  public async signIn(url: Omit<URLParse, 'set'>) {
    if (!url.query.code) throw this._errorService.businessHandle('No external code in success url');
    const code = url.query.code[url.query.code.length - 1] === '/' ? url.query.code.slice(0, -1) : url.query.code;
    const res = await this._gw.externalConfirm({ type: this.props!.type, code });
    await this._service.signIn(res, { password: '', login: '' });
  }
}
