import { IVSortXModel, VSortX } from '@invest.wl/common';
import { EDSortDirection, IoC, TObject } from '@invest.wl/core';
import { VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import isEqual from 'lodash/isEqual';
import { action, computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { VThemeUtil } from '../../../../Theme/V.Theme.util';
import { shadowStyle } from '../../../../util/style.util';
import { VButton } from '../../../Input/Button';
import { VSelect } from '../../../Input/Select';
import { VTouchable } from '../../../Input/Touchable';
import { IVFlexProps, VCol, VRow } from '../../../Layout/Flex';
import { VModalBottom } from '../../../Layout/Modal/component/V.ModalBottom.component';
import { VText } from '../../Text';

export interface IVListSortProps<I extends TObject> extends IVFlexProps {
  title: string;
  model: VSortX<I>;
  summaryBottom?: boolean;
}

@observer
export class VSort<I extends TObject> extends React.Component<IVListSortProps<I>> {
  public static defaultProps = {
    title: 'Сортировка',
    summaryBottom: true,
  };

  private selected?: IVSortXModel<any>;
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  @computed
  public get selectList() {
    return this.props.model.list.map(a => ({ name: a.value.config.title || '', value: a.value }));
  }

  constructor(props: IVListSortProps<I>) {
    super(props);
    makeObservable(this);
  }

  public render() {
    const { model, title, summaryBottom, ...flexProps } = this.props;
    const theme = this.theme.kit.Filter;

    return (
      <VCol topRadius={theme.sRadius?.md} {...shadowStyle(5)} bg={VThemeUtil.colorPick(theme.cBg)} {...flexProps}>
        {!!summaryBottom && (
          <VTouchable.Opacity onPress={model.modalMain.open}>
            <VRow pa={theme.sPadding?.md} justifyContent={'space-between'}>
              <VText style={theme.title.fText} color={VThemeUtil.colorPick(theme.title.cText)}>{title}</VText>
              <VText style={theme.state.fText}
                color={VThemeUtil.colorPick(model.isEmpty ? theme.state.cInactive : theme.state.cActive)}>{model.state}</VText>
            </VRow>
          </VTouchable.Opacity>
        )}
        {this._modalMainRender}
      </VCol>
    );
  }

  @computed
  private get _modalMainRender() {
    const {
      title, model: { apply, modalMain, isEmpty },
    } = this.props;
    const theme = this.theme.kit.Filter;

    return (
      <VModalBottom model={modalMain} onClose={modalMain.close} isSwipeClose>
        <VModalBottom.Header pa={theme.list.header.sPadding?.md} bg={VThemeUtil.colorPick(theme.list.header.cBg)}>
          <VRow justifyContent={'space-between'} alignItems={'center'}>
            <VText style={theme.list.header.fText} color={VThemeUtil.colorPick(theme.list.header.cText)}>{title}</VText>
            <VTouchable.Opacity onPress={this._sortDirectionToggle} disabled={false}>
              <VText style={theme.state.fText}
                color={VThemeUtil.colorPick(isEmpty ? theme.state.cInactive : theme.state.cActive)}>{this.props.model.direction}</VText>
            </VTouchable.Opacity>
          </VRow>
        </VModalBottom.Header>
        <VModalBottom.Body>
          <VCol pb={theme.list.sPadding?.md} ph={theme.list.sPadding?.md}>
            <VSelect.Radio data={this.selectList} selected={this.props.model.activeSingle?.value}
              onChange={this._sortSelect} reverse />
            <VRow mt={theme.button.sMargin?.md}>
              <VButton.Stroke flex onPress={this._clear} color={this.theme.color.accent1}>Снять</VButton.Stroke>
              <VButton.Fill flex ml={theme.button.sMargin?.md} onPress={apply}>Применить</VButton.Fill>
            </VRow>
          </VCol>
        </VModalBottom.Body>
      </VModalBottom>
    );
  }

  private _sortDirectionToggle = () => {
    const v = this.props.model.activeSingle?.value.domain.dto === EDSortDirection.Desc ? EDSortDirection.Asc : EDSortDirection.Desc;
    this.props.model.activeSingle?.value.domain.lvSet(v);
  };

  private _sortSelect = (m: IVSortXModel<any>) => {
    m.domain.lvSet(this.props.model.activeSingle?.value.domain.dto || EDSortDirection.Desc);
    if (isEqual(this.selected, m)) this._clear();
    else this.selected = m;
  };

  @action
  private _clear = () => {
    this.props.model.clear();
    this.selected = undefined;
  };
}
