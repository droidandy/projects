import { CompoundUtils } from '@effectivetrade/effective-mobile/src/view/CompoundUtils/Compound.component';
import { IoC } from '@invest.wl/core';
import { VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import React from 'react';
import { VThemeUtil } from '../../../Theme/V.Theme.util';

import { VShadow } from '../../Decoration';
import { VButton } from '../../Input/Button/V.Button.component';
import { IVButtonModelProps } from '../../Input/Button/V.Button.types';
import { IVFlexProps, VCol, VRow } from '../../Layout/Flex';
import { VIcon } from '../../Output/Icon';
import { IVTextProps, VText } from '../../Output/Text';

export type IVDisclaimerProps = IVFlexProps;

export class VDisclaimer extends React.Component<IVDisclaimerProps> {
  public static Title = (_: IVTextProps) => null;
  public static Close = (_: IVButtonModelProps<any>) => null;
  public static Text = (_: IVTextProps) => null;
  public static Button = (_: IVButtonModelProps<any>) => null;

  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  public render() {
    const theme = this.theme.kit.Disclaimer;
    const { elevation, ...flexProps } = this.props;

    return (
      <VShadow level={elevation || 3} {...flexProps}>
        <VCol pa={theme.sPadding?.md}>
          <VRow justifyContent={'space-between'} alignItems={'center'}>
            <VRow alignItems={'center'} flex>
              <VIcon name={'warning'} bg={VThemeUtil.colorPick(theme.icon.cBg)}
                color={VThemeUtil.colorPick(theme.icon.cMain)}
                radius={theme.icon.sRadius?.md} fontSize={theme.icon.sFont?.md} pa={theme.icon.sPadding?.md}
                overflow={'hidden'} />
              <CompoundUtils.Find peers={this.props.children} byPeerType={VDisclaimer.Title}>{e => !!e && (
                <VText style={theme.title.fText} color={VThemeUtil.colorPick(theme.title.cText)} ml={theme.sMargin?.md}
                  flex {...e.props} />
              )}</CompoundUtils.Find>
            </VRow>
            <CompoundUtils.Find peers={this.props.children} byPeerType={VDisclaimer.Close}>{e => !!e &&
              <VButton.Close ml={theme.sMargin?.md} {...e.props} />
            }</CompoundUtils.Find>
          </VRow>
          <CompoundUtils.Find peers={this.props.children} byPeerType={VDisclaimer.Text}>{e => !!e &&
            <VText font={theme.fText} color={VThemeUtil.colorPick(theme.cText)} mt={theme.sMargin?.md} {...e.props} />
          }</CompoundUtils.Find>
          <CompoundUtils.Find peers={this.props.children} byPeerType={VDisclaimer.Button}>{e => !!e &&
            <VButton.Fill mt={theme.sMargin?.md} {...e.props} />
          }</CompoundUtils.Find>
          {this.props.children}
        </VCol>
      </VShadow>
    );
  }
}
