import React from 'react';
import { observer } from 'mobx-react';
import { IVLayoutOperationTabProps, IVLayoutOperationTabsScreenProps } from './V.LayoutOperation.types';
import { mapScreenPropsToProps } from '@invest.wl/mobile/src/view/util/react.util';
import {
  createHeaderTabBar, IVTabsRouteItem, VContainer, VContent, VNavBar, VStatusBar, VTouchable,
} from '@invest.wl/mobile/src/view/kit';
import { EVOrderScreen } from '@invest.wl/view/src/Order/V.Order.types';
import { EVTradeScreen } from '@invest.wl/view/src/Trade/V.Trade.types';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { EventX } from '@invest.wl/common/src/reactive/EventX/EventX';
import { VInputStringModel } from '@invest.wl/view/src/Input/model/V.InputString.model';
import { DInputStringModel } from '@invest.wl/domain/src/Input/model/D.InputString.model';
import { action, makeObservable, observable } from 'mobx';
import { VTradeListTab } from '../../../Trade/tab/List/V.TradeList.tab';
import { shadowStyle } from '@invest.wl/mobile/src/view/util/style.util';
import { DimensionsWidth } from '@invest.wl/mobile/src/view/Theme';
import { VOrderListTab } from '../../../Order/tab/List/V.OrderList.tab';
import { SHardwareBackHolder } from '@invest.wl/system/src/HardwareBack/S.HardwareBack.holder';
import { IVRouterService, VRouterServiceTid } from '@invest.wl/view/src/Router/V.Router.types';

const OperationTabs = createHeaderTabBar({ swipeEnabled: true });

@mapScreenPropsToProps
@observer
export class VLayoutOperationTabs extends React.Component<IVLayoutOperationTabsScreenProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private router = IoC.get<IVRouterService>(VRouterServiceTid);
  private bh = new SHardwareBackHolder();

  constructor(props: IVLayoutOperationTabsScreenProps) {
    super(props);
    makeObservable(this);
  }

  public componentDidMount() {
    // TODO: why BACK event not invoked here?
    this.bh.subscribe(() => {
      if (this._searchShow) this._searchClose();
      else this.router.back();
    });
  }

  public componentWillUnmount() {
    this.bh.dispose();
  }

  @observable private _searchShow = false;
  private _filterX = new EventX<boolean>();
  private _search = new VInputStringModel(new DInputStringModel());

  private _routes: IVTabsRouteItem[] = [{
    name: EVOrderScreen.OrderList, screen: VOrderListTab, title: 'Заявки',
    props: { filterEventX: this._filterX, searchModel: this._search } as IVLayoutOperationTabProps,
  }, {
    name: EVTradeScreen.TradeList, screen: VTradeListTab, title: 'Сделки',
    props: { filterEventX: this._filterX, searchModel: this._search } as IVLayoutOperationTabProps,
  }];

  public render() {
    return (
      <VContainer>
        <VStatusBar translucent />
        {!this._searchShow && (
          <VNavBar {...shadowStyle(0)}>
            <VNavBar.Back />
            <VNavBar.Title text={'Операции'} />
            <VNavBar.RightIcon name={'search'} mr={this.theme.space.lg} onPress={this._searchOpen} />
            <VNavBar.RightIcon name={'filter'} onPress={this._onFilter} />
          </VNavBar>
        )}
        {this._searchShow && (
          <VNavBar {...shadowStyle(0)}>
            <VNavBar.LeftIcon name={'nav-back'} onPress={this._searchClose} />
            <VNavBar.Input autoFocus model={this._search} />
          </VNavBar>
        )}
        <VContent noScroll>
          <VTouchable.Opacity activeOpacity={1} flex onPress={this._searchClose}>
            <OperationTabs itemWidthMin={DimensionsWidth * 0.49} routes={this._routes}
              onBlur={this._searchClose} {...shadowStyle(1)} />
          </VTouchable.Opacity>
        </VContent>
      </VContainer>
    );
  }

  @action
  private _searchOpen = () => this._searchShow = true;

  @action
  private _searchClose = () => {
    this._searchShow = false;
    this._search.onChangeText('');
  };
  private _onFilter = () => this._filterX.emit(true);
}
