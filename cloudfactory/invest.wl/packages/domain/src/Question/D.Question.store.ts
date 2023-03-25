import { Inject, Injectable } from '@invest.wl/core';
import { reaction } from 'mobx';
import { IDQuestionAnswerSaveDTO } from '../../../core';
import { DAuthStore } from '../Auth/D.Auth.store';
import { DAuthStoreTid } from '../Auth/D.Auth.types';
import { DQuestionGateway } from './D.Question.gateway';
import { DQuestionGatewayTid } from './D.Question.types';

@Injectable()
export class DQuestionStore {
  public sectionListX = this._gw.sectionList({
    name: 'DQuestionStore.sectionListX',
    req: () => this._authStore ? {} : undefined,
  });

  constructor(
    @Inject(DQuestionGatewayTid) private _gw: DQuestionGateway,
    @Inject(DAuthStoreTid) private _authStore: DAuthStore,
    // @Inject(DCustomerStoreTid) @optional() private _customerStore?: DCustomerStore,
  ) {
    reaction(() => this._authStore.authenticated,
      (authenticated) => authenticated ? this.sectionListX.source.refresh() : this.sectionListX.source.clear());
  }

  public async save(list: IDQuestionAnswerSaveDTO[]) {
    const res = await this._gw.answerSave({ list });
    // this._customerStore?.permission.source.refresh();
    return res;
  }
}
