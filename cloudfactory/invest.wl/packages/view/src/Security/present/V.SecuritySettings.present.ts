import { Inject, Injectable } from '@invest.wl/core';
import { DSecuritySettingCase, DSecuritySettingCaseTid, IDSecuritySettingCaseProps } from '@invest.wl/domain';
import { action, makeObservable } from 'mobx';

export const VSecuritySettingsPresentTid = Symbol.for('VSecuritySettingsPresentTid');

export interface IVSecuritySettingsPresentProps extends IDSecuritySettingCaseProps {
}

@Injectable()
export class VSecuritySettingsPresent {
  constructor(
    @Inject(DSecuritySettingCaseTid) public cse: DSecuritySettingCase,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IVSecuritySettingsPresentProps) {
    this.cse.init(props);
  }
}
