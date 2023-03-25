import { Inject, Injectable, Newable, TModelId } from '@invest.wl/core';

import { action, computed, makeObservable, observable, when } from 'mobx';
import { IDBankAccountModel } from '../model/D.BankAccount.model';
import { DBankAccountEditModel, DBankAccountEditModelTid } from '../model/D.BankAccountEdit.model';

export const DBankAccountEditCaseTid = Symbol.for('DBankAccountEditCaseTid');

export interface IDBankAccountEditCaseProps {
  // если указано - тогда редактируем, иначе новый счет
  id?: TModelId;
}

@Injectable()
export class DBankAccountEditCase {
  @observable.ref public props?: IDBankAccountEditCaseProps;
  @observable public isBusy = false;

  public model = new this._editModel();

  constructor(
    // @Inject(DBankAccountStoreTid) private _store: DBankAccountStore,
    // @Inject(DBankAccountGatewayTid) private _gateway: DBankAccountGateway,
    @Inject(DBankAccountEditModelTid) private _editModel: Newable<typeof DBankAccountEditModel>,
  ) {
    makeObservable(this);
    when(() => !!this._item,
      () => { this.model.fromDTO(this._item.dto); });
  }

  @action
  public init(props: IDBankAccountEditCaseProps) {
    this.props = props;
  }

  @computed
  private get _item() {
    return null as unknown as IDBankAccountModel;
    //   return this._store.list.list.find(i => i.dto?.id === this._id);
  }

  @action
  public async save() {
    this.isBusy = true;
    try {
      // await this._gateway.save(this.model.asDTO);
      // await this._store.listX.source.refresh();
    } catch (e: any) {
      e.message = `При сохранении банковского счета возникла ошибка. ${e.message}`;
      throw e;
    } finally {
      this.isBusy = false;
    }
  }

  // @action
  // public async delete() {
  //   this.isBusy = true;
  //   try {
  //     // await this._gateway.delete({ id: this._id! });
  //     // await this._store.list.source.refresh();
  //   } catch (e: any) {
  //     e.message = 'Ошибка при удалении счета';
  //     throw e;
  //   } finally {
  //     this.isBusy = false;
  //   }
  // }
}
