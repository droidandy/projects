import React from 'react';
import { observer } from 'mobx-react';
import { VButton, VCol, VProgressBar, VRow, VText, VTouchable } from '@invest.wl/mobile/src/view/kit';
import { computed, makeObservable } from 'mobx';
import { EDInstrumentAssetType } from '@invest.wl/core/src/dto/Instrument';
import { VPortfelPLGroupStat } from './V.PortfelPLGrouptStat.component';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VPortfelPLGroupModel } from '@invest.wl/view/src/Portfel/model/V.PortfelPLGroup.model';
import { EVPortfelScreen } from '@invest.wl/view/src/Portfel/V.Portfel.types';
import { EDPortfelGroup } from '@invest.wl/core/src/dto/Portfel';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VPortfelConfig } from '@invest.wl/view/src/Portfel/V.Portfel.config';
import { VPortfelPLGroupMoneyItem } from './V.PortfelPLGroupMoneyItem.component';
import { IVRouterService, VRouterServiceTid } from '@invest.wl/view/src/Router/V.Router.types';

export interface IVPortfelPLGroupByInstrumentTypeItemProps {
  model: VPortfelPLGroupModel;
}

@observer
export class VPortfelPLGroupByInstrumentTypeItem extends React.Component<IVPortfelPLGroupByInstrumentTypeItemProps> {
  private router = IoC.get<IVRouterService>(VRouterServiceTid);
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  constructor(props: IVPortfelPLGroupByInstrumentTypeItemProps) {
    super(props);
    makeObservable(this);
  }

  public render() {
    const { model } = this.props;
    const { domain, instrumentAssetType } = model;
    const { color, space } = this.theme;

    return (
      <VTouchable.Opacity context={domain.instrumentAssetType}
        onPress={!domain.isEmpty ? this.portfelInstrumentTypeNav : undefined}>
        <VRow justifyContent={'space-between'}>
          <VCol flex>
            <VText runningLine>{instrumentAssetType}</VText>
          </VCol>
          {!domain.isEmpty && <VPortfelPLGroupStat ml={'md'} alignItems={'flex-end'} model={this.props.model} />}
          {model.canBuy && (
            <VButton.Fill ph={space.lg} color={color.accent1} size={'sm'}
              context={domain.instrumentAssetType} onPress={this.instrumentQuoteNav}>Купить</VButton.Fill>
          )}
        </VRow>
        <VProgressBar mt={space.lg} percent={domain.mvGroupPercent} text />
        {this.moneyRender}
      </VTouchable.Opacity>
    );
  }

  @computed
  private get moneyRender() {
    const { groupX, domain: { instrumentAssetType } } = this.props.model;
    if (instrumentAssetType !== EDInstrumentAssetType.Money || !groupX.innerX?.list.length) return;
    const { color, space } = this.theme;

    return (
      <>
        <VRow mt={space.lg} height={1} bg={color.muted1} mh={-space.lg} />
        <VCol mb={-space.lg}>
          {groupX.innerX.list.map((g) => (
            <VPortfelPLGroupMoneyItem key={g.id} model={g} />
          ))}
        </VCol>
      </>
    );
  }

  private instrumentQuoteNav = (assetType: EDInstrumentAssetType) => {
    if (!VPortfelConfig.asset2nav[assetType]) return console.error(`no value for type: ${assetType}`);
    this.router.navigateTo(VPortfelConfig.asset2nav[assetType]!);
  };

  private portfelInstrumentTypeNav = (assetType: EDInstrumentAssetType) => {
    const account = this.props.model.domain.itemFirst?.dto.Account;
    if (!account?.id) return console.error('no account');
    this.router.navigateTo(EVPortfelScreen.PortfelInstrumentType, {
      type: assetType, accountIdList: [account.id],
      groupList: [EDPortfelGroup.InstrumentAssetType, EDPortfelGroup.InstrumentId],
    });
  };
}
