import { Formatter, ILambda, IVModelX, VModelX } from '@invest.wl/common';
import { EDDocumentStatus, Injectable, IoC } from '@invest.wl/core';
import { IDDocumentModel } from '@invest.wl/domain';
import { computed, makeObservable } from 'mobx';
import { TVIconName } from '../../Icon/V.Icon.types';
import { IVThemeStore, TVThemeColor, TVThemeColorValue, VThemeStoreTid } from '../../Theme/V.Theme.types';
import { IVDocumentI18n, VDocumentI18nTid } from '../V.Document.types';

export const VDocumentModelTid = Symbol.for('VDocumentModelTid');

export interface IVDocumentModel extends IVModelX<IDDocumentModel> {
  readonly status: string;
  readonly color: TVThemeColorValue;
  readonly icon: TVIconName;
  readonly createDate: string;
  readonly isSelectable: boolean;
}

@Injectable()
export class VDocumentModel extends VModelX<IDDocumentModel> implements IVDocumentModel {
  protected _i18n = IoC.get<IVDocumentI18n>(VDocumentI18nTid);
  protected _theme = IoC.get<IVThemeStore>(VThemeStoreTid);

  protected _displayMap: { [S in EDDocumentStatus]: { color: TVThemeColor; icon: TVIconName } } = {
    [EDDocumentStatus.Draft]: { color: 'positive', icon: 'info' },
    [EDDocumentStatus.New]: { color: 'primary1', icon: 'info' },
    [EDDocumentStatus.Processed]: { color: 'primary2', icon: 'info' },
    [EDDocumentStatus.Signed]: { color: 'positive', icon: 'operation-done' },
    [EDDocumentStatus.Archive]: { color: 'muted1', icon: 'info' },
    [EDDocumentStatus.Error]: { color: 'negative', icon: 'operation-rejected' },
  };

  @computed
  public get status() {
    return this._i18n.status[this.domain.dto.status] || 'Неизвестный статус';
  }

  @computed
  public get color() {
    return this._displayMap[this.domain.dto.status]?.color || this._theme.color.primary1;
  }

  @computed
  public get icon(): TVIconName {
    return this._displayMap[this.domain.dto.status]?.icon || 'info';
  }

  @computed
  public get createDate() {
    return Formatter.date(this.domain.dto.createDate, { pattern: 'days' });
  }

  @computed
  public get isSelectable() {
    return this.domain.isSigned || this.domain.isNew;
  }

  constructor(dtoLV: ILambda<IDDocumentModel>) {
    super(dtoLV);
    makeObservable(this);
  }
}
