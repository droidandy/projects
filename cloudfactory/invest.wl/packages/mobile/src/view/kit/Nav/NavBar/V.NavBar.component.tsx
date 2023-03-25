import { ReactUtils } from '@effectivetrade/effective-mobile/src/view/reactUtils/reactUtils.helper';
import { CompoundUtils } from '@effectivetrade/effective-mobile/src/view/CompoundUtils/Compound.component';
import { IoC } from '@invest.wl/core';
import { VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import { computed, makeObservable } from 'mobx';
import React from 'react';
import { VThemeUtil } from '../../../Theme/V.Theme.util';

import { IVFlexProps, VCol, VRow } from '../../Layout';
import { IVTextProps, VText } from '../../Output';
import { VNavBarBack } from './V.NavBarBack.component';
import { IVNavBarIconProps, VNavBarIcon } from './V.NavBarIcon.component';
import { VNavBarInput } from './V.NavBarInput.component';
import { VNavBarInstrumentAlert } from './V.NavBarInstrumentAlert.component';
import { VNavBarInstrumentSearch } from './V.NavBarInstrumentSearch.component';
import { VNavBarOperationMenu } from './V.NavBarOperationMenu.component';
import { VNavBarOperationTabs } from './V.NavBarOperationTabs.component';
import { VNavBarProfile } from './V.NavBarProfile.component';
import { VNavBarText } from './V.NavBarText.component';

export interface IVNavBarProps extends IVFlexProps {
  middleCenter: boolean;
}

export class VNavBar extends React.Component<IVNavBarProps> {
  public static defaultProps = {
    middleCenter: true,
  };

  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  public static Back = VNavBarBack;
  public static OperationTabs = VNavBarOperationTabs;
  public static OperationMenu = VNavBarOperationMenu;
  public static Profile = VNavBarProfile;
  public static RightText = VNavBarText;
  public static Input = VNavBarInput;
  public static InstrumentSearch = VNavBarInstrumentSearch;
  public static InstrumentAlertRight = (_: Partial<IVNavBarIconProps>) => null;
  public static InstrumentAlertLeft = (_: Partial<IVNavBarIconProps>) => null;
  public static Middle = (_: IVFlexProps) => null;
  public static TitleSub = (_: IVTextProps) => null;
  public static Title = (_: IVTextProps) => null;
  public static LeftIcon = (_: IVNavBarIconProps) => null;
  public static RightIcon = (_: IVNavBarIconProps) => null;

  private static _componentListLeft = [VNavBar.Back, VNavBar.OperationTabs, VNavBar.OperationMenu, VNavBar.Profile, VNavBar.InstrumentAlertLeft, VNavBar.LeftIcon];
  private static _componentListRight = [VNavBar.RightText, VNavBar.InstrumentSearch, VNavBar.InstrumentAlertRight, VNavBar.RightIcon];

  constructor(props: IVNavBarProps) {
    super(props);
    makeObservable(this);
  }

  public render() {
    const theme = this.theme.kit.NavBar;
    const { children, ...flexProps } = this.props;

    return (
      <VRow height={theme.sHeight?.md} ph={theme.sPadding?.md}
        bg={VThemeUtil.colorPick(theme.cBg)} {...theme.shadow}
        justifyContent={'space-between'} alignItems={'center'}
        topRadius={theme.top?.sRadius?.md}
        {...flexProps}>
        <VRow flex={this._flexEdge} mr={this._hasComponentLeft ? 'lg' : undefined}>
          <CompoundUtils.Find peers={children} byPeerType={VNavBar.Back}>
            {e => !!e && e}
          </CompoundUtils.Find>
          <CompoundUtils.Find peers={children} byPeerType={VNavBar.OperationTabs}>
            {e => !!e && e}
          </CompoundUtils.Find>
          <CompoundUtils.Find peers={children} byPeerType={VNavBar.OperationMenu}>
            {e => !!e && e}
          </CompoundUtils.Find>
          <CompoundUtils.Find peers={children} byPeerType={VNavBar.Profile}>
            {e => !!e && e}
          </CompoundUtils.Find>
          <CompoundUtils.Filter peers={children} byPeerType={VNavBar.LeftIcon}>{l => !!l?.length &&
            l.map((e, index) => (
              <VNavBarIcon key={index} {...e.props} />
            ))
          }</CompoundUtils.Filter>
          <CompoundUtils.Find peers={children} byPeerType={VNavBar.InstrumentAlertLeft}>
            {e => !!e && <VNavBarInstrumentAlert {...e.props} />}
          </CompoundUtils.Find>
        </VRow>
        <CompoundUtils.Find peers={children} byPeerType={VNavBar.Middle}>{e => (
          <VCol flex={3} alignItems={'center'} {...e?.props}>
            {!!e?.props.children ? e.props.children : (
              <>
                <CompoundUtils.Find peers={children} byPeerType={VNavBar.Title}>
                  {e => !!e && (
                    <VText style={theme.title.fText} color={VThemeUtil.colorPick(theme.title.cText)}
                      ta={'center'} {...e.props} />
                  )}
                </CompoundUtils.Find>
                <CompoundUtils.Find peers={children} byPeerType={VNavBar.TitleSub}>
                  {e => !!e && (
                    <VText mt={theme.titleSub.sMargin?.md} style={theme.titleSub.fText}
                      color={VThemeUtil.colorPick(theme.titleSub.cText)} ta={'center'} {...e.props} />
                  )}
                </CompoundUtils.Find>
              </>
            )}
          </VCol>
        )}</CompoundUtils.Find>
        <VRow flex={this._flexEdge} ml={this._hasComponentRight ? 'lg' : undefined} justifyContent={'flex-end'}>
          <CompoundUtils.Filter peers={children} byPeerType={VNavBar.RightIcon}>{l => !!l?.length &&
            l.map((e, index) => (
              <VNavBarIcon key={index} {...e.props} />
            ))
          }</CompoundUtils.Filter>
          <CompoundUtils.Find peers={children} byPeerType={VNavBar.RightText}>
            {e => !!e && <VNavBarText {...e.props} />}
          </CompoundUtils.Find>
          <CompoundUtils.Find peers={children} byPeerType={VNavBar.InstrumentAlertRight}>
            {e => !!e && <VNavBarInstrumentAlert {...e.props} />}
          </CompoundUtils.Find>
          <CompoundUtils.Find peers={children} byPeerType={VNavBar.InstrumentSearch}>
            {e => !!e && e}
          </CompoundUtils.Find>
        </VRow>
        <CompoundUtils.Find peers={children} byPeerType={VNavBar.Input}>{e => !!e && (
          <VCol absolute right={theme.sPadding?.md} width={'90%'} flexGrow={50} height={'100%'}
            justifyContent={'center'}>{e}</VCol>
        )}</CompoundUtils.Find>
      </VRow>
    );
  }

  @computed
  private get _hasComponentLeft() {
    return !!ReactUtils.findElement(this.props.children, el => VNavBar._componentListLeft.includes(el.type as any));
  }

  @computed
  private get _hasComponentRight() {
    return !!ReactUtils.findElement(this.props.children, el => VNavBar._componentListRight.includes(el.type as any));
  }

  @computed
  private get _hasComponentEdge() {
    return this._hasComponentLeft || this._hasComponentRight;
  }

  @computed
  private get _flexEdge() {
    return this.props.middleCenter && this._hasComponentEdge ? 1 : 0;
  }
}
