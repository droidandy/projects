import React from 'react';
import { observer } from 'mobx-react';
import { IVFlexProps, VCol, VRow, VText, VThumbnail } from '@invest.wl/mobile/src/view/kit';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { IVInstrumentIdentityMpart } from '@invest.wl/view/src/Instrument/mpart/V.InstrumentIdentity.mpart';
import { CompoundUtils } from '@effectivetrade/effective-mobile/src/view/CompoundUtils';

export interface IVInstrumentIdentityProps extends IVFlexProps {
  mpart: IVInstrumentIdentityMpart;
}

@observer
export class VInstrumentIdentity extends React.Component<IVInstrumentIdentityProps> {
  public static RightTopAdd = (props: IVFlexProps) => <>{props.children}</>;
  public static RightBottom = (_: IVFlexProps) => null;

  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  public render() {
    const { mpart, children, ...flexProps } = this.props;
    const { color, space } = this.theme;

    return (
      <VRow alignItems={'center'} {...flexProps}>
        <VThumbnail uri={mpart.imageSrc} mr={space.md} />
        <VCol flex>
          <VRow alignItems={'center'} mr={space.xs}>
            <VText font={'body6'} mr={space.xs} runningLine>{mpart.name}</VText>
            <CompoundUtils.Find peers={children} byPeerType={VInstrumentIdentity.RightTopAdd}>
              {e => !!e && e}
            </CompoundUtils.Find>
          </VRow>
          <CompoundUtils.Find peers={children} byPeerType={VInstrumentIdentity.RightBottom}>{e => !!e ? (
            <VRow {...e.props} />
          ) : (
            <VText font={'body17'} color={color.muted4}>{mpart.secureCode}</VText>
          )}</CompoundUtils.Find>
        </VCol>
      </VRow>
    );
  }
}
