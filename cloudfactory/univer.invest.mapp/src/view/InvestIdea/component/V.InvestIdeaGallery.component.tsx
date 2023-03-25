import React from 'react';
import { observer } from 'mobx-react';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { VInvestIdeaCard } from './V.InvestIdeaCard.component';
import { IVFlexProps, VCol, VRow, VText } from '@invest.wl/mobile/src/view/kit';
import { computed, makeObservable } from 'mobx';
import { EVInvestIdeaScreen } from '@invest.wl/view/src/InvestIdea/V.InvestIdea.types';
import { VInvestIdeaItemModel } from '@invest.wl/view/src/InvestIdea/model/V.InvestIdeaItem.model';
import { IVRouterService, VRouterServiceTid } from '@invest.wl/view/src/Router/V.Router.types';

export interface IVInvestIdeaGalleryProps extends IVFlexProps {
  list: VInvestIdeaItemModel[];
}

@observer
export class VInvestIdeaGallery extends React.Component<IVInvestIdeaGalleryProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private router = IoC.get<IVRouterService>(VRouterServiceTid);

  constructor(props: IVInvestIdeaGalleryProps) {
    super(props);
    makeObservable(this);
  }

  public render() {
    const { list, ...flexProps } = this.props;

    return (
      <VCol {...flexProps}>
        {this._header}
        <FlatList horizontal={true} data={list} renderItem={this.itemRender} />
      </VCol>
    );
  }

  private itemRender = (data: ListRenderItemInfo<VInvestIdeaItemModel>) => {
    const { space } = this.theme;
    const isLast = data.index === (this.props.list.length - 1);

    return (
      <VInvestIdeaCard maxWidth={150} pa={space.lg}
        mv={space.lg} ml={space.lg} mr={isLast ? space.lg : 0}
        model={data.item} onPress={this.investIdeaGo} />
    );
  };

  @computed
  private get _header() {
    const { color, space } = this.theme;
    return (
      <VRow justifyContent={'space-between'} ph={space.lg}>
        <VText font={'title5'}>{'Инвестидеи'}</VText>
        <VText font={'body13'} color={color.link} onPress={this.investIdeaListGo}>{'Все'}</VText>
      </VRow>
    );
  };

  private investIdeaListGo = () => this.router.navigateTo(EVInvestIdeaScreen.InvestIdeaList);
  private investIdeaGo = (m: VInvestIdeaItemModel) => this.router.navigateTo(EVInvestIdeaScreen.InvestIdea, { id: m.id });
}
