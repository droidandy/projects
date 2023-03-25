import React from 'react';
import { observer } from 'mobx-react';
import { VCol, VProgressBar, VRow, VTouchable } from '@invest.wl/mobile/src/view/kit';
import { VAccountIdentity } from '../../Account';
import { VPortfelPLGroupStat } from './V.PortfelPLGrouptStat.component';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { EDPortfelGroup } from '@invest.wl/core/src/dto/Portfel';
import { EVPortfelScreen } from '@invest.wl/view/src/Portfel/V.Portfel.types';
import { VPortfelPLGroupModel } from '@invest.wl/view/src/Portfel/model/V.PortfelPLGroup.model';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { IVRouterService, VRouterServiceTid } from '@invest.wl/view/src/Router/V.Router.types';

export interface IVPortfelPLGroupByAccountItemProps {
  model: VPortfelPLGroupModel;
}

@observer
export class VPortfelPLGroupByAccountItem extends React.Component<IVPortfelPLGroupByAccountItemProps> {
  private router = IoC.get<IVRouterService>(VRouterServiceTid);
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  public render() {
    const { model } = this.props;

    return (
      <VTouchable.Opacity onPress={this.go}>
        <VCol>
          <VRow justifyContent={'space-between'}>
            {!!model.accountX.model ? (<VAccountIdentity flex mpart={model.accountX.model.identity} />) : <VCol />}
            <VPortfelPLGroupStat ml={'md'} alignItems={'flex-end'} model={model} />
          </VRow>
          <VProgressBar mt={this.theme.space.lg} percent={model.domain.mvPortfelPercent} text />
        </VCol>
      </VTouchable.Opacity>
    );
  }

  private go = () => this.router.push(EVPortfelScreen.Portfel, {
    groupList: [EDPortfelGroup.InstrumentAssetType, EDPortfelGroup.InstrumentId],
    accountIdList: [this.props.model.id],
  });
}
