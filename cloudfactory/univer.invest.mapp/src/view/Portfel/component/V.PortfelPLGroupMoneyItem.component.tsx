import React from 'react';
import { observer } from 'mobx-react';
import { VCol, VRow, VText } from '@invest.wl/mobile/src/view/kit';
import { VPortfelPLGroupModel } from '@invest.wl/view/src/Portfel/model/V.PortfelPLGroup.model';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { computed, makeObservable } from 'mobx';
import { VPortfelPLGroupStat } from './V.PortfelPLGrouptStat.component';

export interface IVPortfelPLGroupMoneyItemProps {
  model: VPortfelPLGroupModel;
}

@observer
export class VPortfelPLGroupMoneyItem extends React.Component<IVPortfelPLGroupMoneyItemProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  constructor(props: IVPortfelPLGroupMoneyItemProps) {
    super(props);
    makeObservable(this);
  }

  @computed
  private get _isRub() {
    return this.props.model.itemFirst?.domain.type.isMoneyRub;
  }

  public render() {
    const { model } = this.props;
    const { space, color } = this.theme;

    return (
      <VRow pv={space.lg} justifyContent={'space-between'} alignItems={'center'}>
        <VCol flex>
          <VText font={'body5'} runningLine>{model.itemFirst?.identity.name}</VText>
          {!this._isRub && <VText mt={space.xs} font={'body20'} color={color.muted3} runningLine>{model.amount}</VText>}
        </VCol>
        <VPortfelPLGroupStat ml={'md'} alignItems={'flex-end'} model={this.props.model} />
      </VRow>
    );
  }
}
