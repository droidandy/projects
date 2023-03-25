import { CompoundUtils } from '@effectivetrade/effective-mobile/src/view/CompoundUtils';
import { IoC } from '@invest.wl/core';
import { IVFlexProps, VCol, VRow, VText, VThumbnail } from '@invest.wl/mobile';
import { IVInstrumentIdentityMpart } from '@invest.wl/view/src/Instrument/mpart/V.InstrumentIdentity.mpart';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { observer } from 'mobx-react';
import React from 'react';

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
            <VText font={'body5'} mr={space.xs} runningLine>{mpart.name}</VText>
            <CompoundUtils.Find peers={children} byPeerType={VInstrumentIdentity.RightTopAdd}>
              {e => !!e && e}
            </CompoundUtils.Find>
          </VRow>
          <CompoundUtils.Find peers={children} byPeerType={VInstrumentIdentity.RightBottom}>{e => !!e ? (
            <VRow {...e.props} />
          ) : (
            <VText font={'body18'} color={color.link}>{mpart.secureCode}</VText>
          )}</CompoundUtils.Find>
        </VCol>
      </VRow>
    );
  }
}
