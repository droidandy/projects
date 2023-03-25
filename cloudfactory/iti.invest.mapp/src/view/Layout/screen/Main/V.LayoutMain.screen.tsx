import React from 'react';
import { observer } from 'mobx-react';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { createFooterTabBar, IVTabsRouteItem, VCol, VIcon, VText } from '@invest.wl/mobile/src/view/kit';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { computed, makeObservable } from 'mobx';
import { EVLayoutScreen } from '@invest.wl/view/src/Layout/V.Layout.types';
import { mapScreenPropsToProps } from '@invest.wl/mobile/src/view/util/react.util';
import { EDPortfelGroup } from '@invest.wl/core/src/dto/Portfel/D.Portfel.dto';
import { IVPortfelPresentProps } from '@invest.wl/view/src/Portfel/present/V.Portfel.present';
import { VLayoutInstrumentStack } from '../../stack/Instrument/V.LayoutInstrument.stack';
import { VLayoutShowcaseStack } from '../../stack/Showcase/V.LayoutShowcase.stack';
import { VLayoutProfileStack } from '../../stack/Profile/V.LayoutProfile.stack';
import { VLayoutPortfelStack } from '../../stack/Portfel/V.LayoutPortfel.stack';
import { TVIconName } from '@invest.wl/view/src/Icon/V.Icon.types';
import { VThemeUtil } from '@invest.wl/mobile/src/view/Theme';

const MainTabs = createFooterTabBar();

export interface IVMainScreenProps {
}

@mapScreenPropsToProps
@observer
export class VLayoutMainScreen extends React.Component<IVMainScreenProps> {
  private static _screen2icon: { [screen: string]: TVIconName } = {
    [EVLayoutScreen.LayoutPortfelStack]: 'portfel',
    [EVLayoutScreen.LayoutInstrumentStack]: 'quotes',
    [EVLayoutScreen.LayoutShowcaseStack]: 'ideas',
    [EVLayoutScreen.LayoutProfileStack]: 'profile',
  };

  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  constructor(props: IVMainScreenProps) {
    super(props);
    makeObservable(this);
  }

  @computed
  private get _kitTabs() {
    return this.theme.kit.Tabs.Footer;
  }

  private authRouteList: IVTabsRouteItem[] = [{
    name: EVLayoutScreen.LayoutPortfelStack,
    title: 'Портфель',
    screen: VLayoutPortfelStack,
    props: { groupList: [EDPortfelGroup.AccountId] } as IVPortfelPresentProps,
  }, {
    name: EVLayoutScreen.LayoutInstrumentStack,
    title: 'Котировки',
    screen: VLayoutInstrumentStack,
  }, {
    name: EVLayoutScreen.LayoutShowcaseStack,
    title: 'Витрина',
    screen: VLayoutShowcaseStack,
  }, {
    name: EVLayoutScreen.LayoutProfileStack,
    title: 'Профиль',
    screen: VLayoutProfileStack,
  }];

  public render() {
    return (
      // Если завернуть во View с отступами, то возникают подобные проблемы с навигацией https://github.com/react-navigation/react-navigation/issues/9436
      <MainTabs routes={this.authRouteList} itemRender={this._itemRender} />
    );
  }

  private _itemRender = (item: IVTabsRouteItem) => {
    const { cActive, cInactive, sMargin, fTitle } = this._kitTabs.item;
    const color = VThemeUtil.colorPick(item.isActive ? cActive : cInactive);
    return (
      <VCol flex alignItems={'center'} justifyContent={'center'}>
        <VIcon color={color} fontSize={this._kitTabs.icon.sFont?.md} name={VLayoutMainScreen._screen2icon[item.name]} />
        <VText color={color} mt={sMargin?.md} style={fTitle}>{item.title}</VText>
      </VCol>
    );
  };
}
