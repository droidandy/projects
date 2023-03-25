import { EDOwnerSubject, Inject, Injectable, ISelectItem, Newable } from '@invest.wl/core';
import { DInputNumberModel, DOwnerCase, DOwnerCaseTid, IDOwnerCaseProps } from '@invest.wl/domain';
import { action, makeObservable } from 'mobx';
import { VInputNumberModel } from '../../Input/model/V.InputNumber.model';
import { VOwnerModel, VOwnerModelTid } from '../model/V.Owner.model';

export const VOwnerInfoPresentTid = Symbol.for('VOwnerInfoPresentTid');

export interface IVOwnerInfoPresentProps extends IDOwnerCaseProps {
}

@Injectable()
export class VOwnerInfoPresent {
  public subjectModel = new VInputNumberModel(new DInputNumberModel()).valueInputSet(EDOwnerSubject.Service);
  public subjectList: ISelectItem<EDOwnerSubject>[] = [
    { name: 'По вопросам обслуживания', value: EDOwnerSubject.Service },
    { name: 'По другим вопросам', value: EDOwnerSubject.Other },
  ];

  public model = new this._model(this.cse.model);

  constructor(
    @Inject(DOwnerCaseTid) public cse: DOwnerCase,
    @Inject(VOwnerModelTid) private _model: Newable<typeof VOwnerModel>,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IVOwnerInfoPresentProps) {
    this.cse.init(props);
  }
}
