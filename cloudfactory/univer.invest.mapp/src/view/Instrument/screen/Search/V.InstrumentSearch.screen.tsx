import React from 'react';
import { observer } from 'mobx-react';
import { IoC } from '@invest.wl/core/src/di/IoC';
import {
  VContainer, VContent, VNavBar, VStatusBar, VStub, VText, VTouchable,
} from '@invest.wl/mobile/src/view/kit';
import {
  IVInstrumentSearchPresentProps,
  VInstrumentSearchPresent,
  VInstrumentSearchPresentTid,
} from '@invest.wl/view/src/Instrument/present/V.InstrumentSearch.present';
import { VInstrumentList } from '../../component';
import { mapScreenPropsToProps } from '@invest.wl/mobile/src/view/util/react.util';
import { IVLayoutScreenProps } from '@invest.wl/view/src/Layout/V.Layout.types';
import { IVRouterService, VRouterServiceTid } from '@invest.wl/view/src/Router/V.Router.types';
import { IVInstrumentSearchModel } from '@invest.wl/view/src/Instrument/model/V.InstrumentSearch.model';
import { EVInstrumentScreen } from '@invest.wl/view/src/Instrument/V.Instrument.types';
import { computed, makeObservable } from 'mobx';
import { IVThemeStore, VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { FlatList, ListRenderItemInfo } from 'react-native';

export interface IVInstrumentSearchScreenProps extends IVInstrumentSearchPresentProps, IVLayoutScreenProps {
}

@mapScreenPropsToProps
@observer
export class VInstrumentSearchScreen extends React.Component<IVInstrumentSearchScreenProps> {
  private _pr = IoC.get<VInstrumentSearchPresent>(VInstrumentSearchPresentTid);
  private _router = IoC.get<IVRouterService>(VRouterServiceTid);
  private _theme = IoC.get<IVThemeStore>(VThemeStoreTid);

  @computed
  private get _recentList() {
    return [...this._pr.cse.searchRecentList].reverse();
  }

  constructor(props: IVInstrumentSearchScreenProps) {
    super(props);
    makeObservable(this);
  }

  public componentDidMount() {
    this._pr.init(this.props);
  }

  public render() {
    return (
      <VContainer>
        <VStatusBar />
        <VNavBar>
          <VNavBar.Back />
          <VNavBar.Input autoFocus model={this._pr.text} />
        </VNavBar>
        <VContent noScroll>
          <VStub mapXList={[this._pr.searchListX]} inFocus={this.props.inFocus}
            emptySkip={false} empty={this._emptyRender}>
            {() => (
              <VTouchable.Opacity activeOpacity={1} onPress={this._close} flex>
                <VInstrumentList listX={this._pr.searchListX} onPress={this._instrumentNav} />
              </VTouchable.Opacity>
            )}
          </VStub>
        </VContent>
      </VContainer>
    );
  }

  @computed
  private get _emptyRender() {
    const { text, searchListX } = this._pr;
    if (!this._recentList.length || ((text.value?.length || 0) >= 3 && searchListX.source.isLoaded)) {
      return (
        <VTouchable.Opacity activeOpacity={1} onPress={this._close} flex>
          <VStub.Empty>Ничего не найдено</VStub.Empty>
        </VTouchable.Opacity>
      );
    }
    return (
      <VTouchable.Opacity activeOpacity={1} onPress={this._close} flex>
        <VText pa={'lg'} font={'body9'} color={this._theme.color.muted3}>Вы недавно искали</VText>
        <FlatList data={this._recentList} renderItem={this._recentItemRender} keyExtractor={this._keyExtractor} />
      </VTouchable.Opacity>
    );
  }

  private _recentItemRender = (data: ListRenderItemInfo<string>) => (
    <VTouchable.Opacity ph={'lg'} mb={'md'} pv={'md'} context={data.item}
      onPress={this._pr.text.onChangeText}>
      <VText>{data.item}</VText>
    </VTouchable.Opacity>
  );

  private _keyExtractor = (item: string, index: number) => item + index;

  private _instrumentNav = (model: IVInstrumentSearchModel) =>
    this._router.navigateTo(EVInstrumentScreen.Instrument, { cid: model.domain.dto.id });

  private _close = () => {
    if (this._router.canGoBack()) {
      this._router.back();
    }
  };
}
