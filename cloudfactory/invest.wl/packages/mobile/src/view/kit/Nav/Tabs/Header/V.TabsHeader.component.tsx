import { IoC } from '@invest.wl/core';
import { IVRouterService, VRouterServiceTid, VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import { createMaterialTopTabNavigator, MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { DimensionsWidth, VThemeUtil } from '../../../../Theme/V.Theme.util';
import { VSelectBodyScrollable } from '../../../Input/Select/V.SelectBodyScrollable.component';
import { VTouchable } from '../../../Input/Touchable';
import { VRow } from '../../../Layout/Flex';
import { VIcon } from '../../../Output';
import { VText } from '../../../Output/Text';
import { IVTabsHeaderProps, IVTabsProps, IVTabsRouteItem } from '../V.Tabs.types';

@observer
class VTabsHeader extends React.Component<IVTabsHeaderProps> {
  private router = IoC.get<IVRouterService>(VRouterServiceTid);
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  constructor(props: IVTabsHeaderProps) {
    super(props);
    makeObservable(this);
  }

  @observable.ref private _bodyScrollable?: VSelectBodyScrollable;

  public render() {
    const { routes, layout, position, jumpTo, state, navigation, descriptors, ...flexProps } = this.props;
    const theme = this.theme.kit.Tabs.Header;

    return (
      <VSelectBodyScrollable bg={VThemeUtil.colorPick(theme.cBg)} ref={this._setRef}
        containerStyle={this.ssContainer}
        activeIndex={this.props.state.index} listLength={routes.length} borderBottomWidth={1}
        borderColor={VThemeUtil.colorPick(theme.cBorder)} {...flexProps}>
        {routes.map(this.itemRender)}
      </VSelectBodyScrollable>
    );
  }

  private itemRender = (route: IVTabsRouteItem, index: number) => {
    const { state: { index: activeIndex }, itemWidthMin } = this.props;
    const isActive = index === activeIndex;
    const {
      sHeight, cActive, cInactive,
      item: { cActive: cItemActive, cInactive: cItemInactive, sFont, fText, border },
      line: { cBg: sLineBg, sHeight: sLineHeight },
    } = this.theme.kit.Tabs.Header;

    return (
      <VTouchable.Opacity key={route.name} justifyContent={'center'} alignItems={'center'}
        borderColor={isActive ? border?.cActive : border?.cInactive}
        width={itemWidthMin} height={sHeight?.md} ml={index && this._itemMarginBetween} borderWidth={border?.sWidth?.md}
        bg={VThemeUtil.colorPick(isActive ? cActive : cInactive)} radius={border?.sRadius?.md}
        context={{ ...route, isActive }} onPress={this._handleOnPress}>
        <VRow height={sHeight?.md} justifyContent={'center'} alignItems={'center'}>
          {route.title && (
            <VText style={fText}
              color={VThemeUtil.colorPick(isActive ? cItemActive : cItemInactive)}>{route.title}</VText>
          )}
          {route.icon && (
            <VIcon name={route.icon} fontSize={sFont?.md}
              color={VThemeUtil.colorPick(isActive ? cItemActive : cItemInactive)} />
          )}
        </VRow>
        {isActive ? (Array.isArray(sLineBg)
          ? (
            <LinearGradient style={SS.line} colors={sLineBg} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <VRow height={sLineHeight?.md} width />
            </LinearGradient>
          )
          : <VRow height={sLineHeight?.md} bg={sLineBg} width />
        ) : <VRow width height={sLineHeight?.md} />}
      </VTouchable.Opacity>
    );
  };

  @computed
  private get _itemMarginBetween() {
    return this._canItemWidthEvenly ? 0 : this.theme.kit.Tabs.Header.item.sMargin?.md || 0;
  }

  @computed
  private get _canItemWidthEvenly() {
    const { itemWidthMin, routes } = this.props;
    return !!itemWidthMin && this._bodyScrollable && itemWidthMin < (this._bodyScrollable.containerWidth / routes.length);
  }

  @computed
  private get ssContainer(): ViewStyle {
    return {
      paddingHorizontal: this._bodyScrollable?.isScrollable ? this.theme.kit.Tabs.Header.sPadding?.md : 0,
    };
  }

  private _handleOnPress = (route: IVTabsRouteItem) => {
    if (route && !route.isActive) {
      this.router.navigateTo(route.name);
      this.props.onChange?.(route.name);
    }
  };

  @action
  private _setRef = (ref: VSelectBodyScrollable) => {
    if (!!ref && !this._bodyScrollable) this._bodyScrollable = ref!;
  };
}

const SS = StyleSheet.create({
  line: { width: '100%' },
});

export interface IVTabsHeaderCreateOpts {
  swipeEnabled?: boolean;
}

export function createHeaderTabBar(opts?: IVTabsHeaderCreateOpts) {
  const Tabs = createMaterialTopTabNavigator();

  return (props: IVTabsProps) => {
    const headerTabBar = (p: MaterialTopTabBarProps) => <VTabsHeader {...p} {...props} />;
    return (
      <Tabs.Navigator
        tabBarPosition={'top'}
        swipeEnabled={opts?.swipeEnabled ?? false}
        // FIX: Если на экране новости свернуть приложение, подождать 2 минуты и вернуться, то элементы схлопываются
        // Ширина в initialLayout фиксит это
        initialLayout={{ width: DimensionsWidth }}
        tabBar={headerTabBar}
        backBehavior={'none'}
      >
        {props.routes.map(route => (
          <Tabs.Screen key={route.name} name={route.name} component={route.screen} initialParams={route.props}
            listeners={{ blur: props.onBlur }} />
        ))}
      </Tabs.Navigator>
    );
  };
}

