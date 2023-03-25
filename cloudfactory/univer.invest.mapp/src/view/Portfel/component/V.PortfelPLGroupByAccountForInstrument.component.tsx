import React from 'react';
import { observer } from 'mobx-react';
import { IVFlexProps, VCol, VProgressBar, VRow, VText } from '@invest.wl/mobile/src/view/kit';
import { VAccountIdentity } from '../../Account';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { IVPortfelPLGroupModel } from '@invest.wl/view/src/Portfel/model/V.PortfelPLGroup.model';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';

export interface IVPortfelPLGroupByAccountForInstrumentProps extends IVFlexProps {
  model: IVPortfelPLGroupModel;
  countOf?: string;
}

@observer
export class VPortfelPLGroupByAccountForInstrument extends React.Component<IVPortfelPLGroupByAccountForInstrumentProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  public render() {
    const { model, countOf, children, ...flexProps } = this.props;
    const { color, space } = this.theme;

    return (
      <VCol {...flexProps}>
        <VRow justifyContent={'space-between'}>
          {!!model.accountX?.model && (
            <VAccountIdentity mpart={model.accountX.model.identity}>
              {!!countOf &&
              <VAccountIdentity.TypeRight ml={space.md} font={'body20'} color={color.muted3} text={countOf} />}
            </VAccountIdentity>
          )}
          {children}
        </VRow>
        <VCol mt={space.lg}>
          {model.statList.map((item, i) => (
            <VRow mt={i ? space.sm : undefined} key={i} justifyContent={'space-between'} alignItems={'center'}>
              <VText font={'body20'} color={color.muted3}>{item.name}</VText>
              <VText font={'body18'}>{item.value}</VText>
            </VRow>
          ))}
        </VCol>
        <VProgressBar mt={space.lg} percent={model.domain.mvPortfelPercent} text />
      </VCol>
    );
  }
}
