import { IoC } from '@invest.wl/core';
import { ISRouterStore, SRouterStoreTid } from '@invest.wl/system';
import { IVRouterService, VRouterServiceTid, VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { observer } from 'mobx-react';
import React from 'react';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { VThemeUtil } from '../../../../Theme/V.Theme.util';
import { shadowStyle } from '../../../../util/style.util';
import { VTouchable } from '../../../Input/Touchable';
import { VCol, VRow } from '../../../Layout/Flex';
import { VText } from '../../../Output/Text';
import { IVTabsFooterProps, IVTabsProps, IVTabsRouteItem } from '../V.Tabs.types';

@observer
class VTabsFooter extends React.Component<IVTabsFooterProps> {
  private router = IoC.get<IVRouterService>(VRouterServiceTid);
  private routerStore = IoC.get<ISRouterStore>(SRouterStoreTid);
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  public render() {
    const { sHeight, cBg, sRadius } = this.theme.kit.Tabs.Footer;
    const routes = this.props.routes;

    return (
      <SafeAreaInsetsContext.Consumer>
        {(insets) => (
          <VCol absolute left right bottom pb={insets?.bottom} bg={cBg} topRadius={sRadius?.md} {...shadowStyle(5)}>
            <VRow height={sHeight?.md}>{routes.map(this.itemRender)}</VRow>
          </VCol>
        )}
      </SafeAreaInsetsContext.Consumer>
    );
  }

  private itemRender = (item: IVTabsRouteItem, index: number) => {
    const { cActive, cInactive, sMargin, fTitle } = this.theme.kit.Tabs.Footer.item;
    const { itemRender, state: { index: activeIndex } } = this.props;
    const isActive = activeIndex === index;
    const color = VThemeUtil.colorPick(isActive ? cActive : cInactive);

    return (
      <VTouchable.Opacity flex key={index} onPress={this.onPress} context={item}>
        {!!itemRender ? itemRender({ ...item, isActive }) : (
          <VCol flex alignItems={'center'} justifyContent={'center'}>
            {!!item.title && <VText color={color} mt={sMargin?.md} style={fTitle}>{item.title}</VText>}
          </VCol>
        )}
      </VTouchable.Opacity>
    );
  };

  private onPress = (item: IVTabsRouteItem) => {
    const screenNext = item.replaceRouteName ?? item.name;
    const stack = this.routerStore.stackCurrent;
    const index = stack.indexOf(screenNext);
    if (index !== -1) {
      this.router.popToTop();
    } else {
      this.router.navigateTo(screenNext);
    }
  };
}

export function createFooterTabBar() {
  const Tabs = createBottomTabNavigator();

  return (props: IVTabsProps) => {
    const FooterTabs0 = (p: BottomTabBarProps) => <VTabsFooter {...p} {...props} />;
    return (
      <Tabs.Navigator lazy={false} backBehavior={'none'} tabBar={FooterTabs0} initialRouteName={props.initialRouteName}>
        {props.routes.map(r => (
          <Tabs.Screen key={r.name} name={r.name} component={r.screen} initialParams={r.props} />))}
      </Tabs.Navigator>
    );
  };
}
