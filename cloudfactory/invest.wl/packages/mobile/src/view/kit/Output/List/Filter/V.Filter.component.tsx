import { EDFilterXType, IDFilterXTarget, VFilterX } from '@invest.wl/common';
import { IoC } from '@invest.wl/core';
import { VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { StyleSheet } from 'react-native';
import { VThemeUtil } from '../../../../Theme/V.Theme.util';
import { shadowStyle } from '../../../../util/style.util';
import { VButton } from '../../../Input/Button';
import { VInputFake } from '../../../Input/InputField/V.InputFake.component';
import { VTouchable } from '../../../Input/Touchable';
import { VCol, VRow } from '../../../Layout/Flex';
import { VModalBottom } from '../../../Layout/Modal/component/V.ModalBottom.component';
import { VText } from '../../Text';
import { VFilterConfig } from './V.Filter.config';

export interface IVListFilterProps<I extends IDFilterXTarget> {
  title: string;
  model: VFilterX<I>;
  summaryBottom?: boolean;
}

@observer
export class VFilter<I extends IDFilterXTarget> extends React.Component<IVListFilterProps<I>> {
  public static defaultProps = {
    title: 'Фильтр',
  };

  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  constructor(props: IVListFilterProps<I>) {
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
        {this._modalListRender}
      </VCol>
    );
  }

  @computed
  private get _modalMainRender() {
    const theme = this.theme.kit.Filter;
    const {
      title, model: { filter, apply, clear, modalMain, modalOpen, isEmpty, state },
    } = this.props;

    return (
      <VModalBottom model={modalMain} onClose={modalMain.close} isSwipeClose>
        <VModalBottom.Header pa={theme.list.header.sPadding?.md} bg={VThemeUtil.colorPick(theme.list.header.cBg)}>
          <VRow justifyContent={'space-between'} alignItems={'center'}>
            <VText style={theme.list.header.fText} color={VThemeUtil.colorPick(theme.list.header.cText)}>{title}</VText>
            <VText style={theme.state.fText}
              color={VThemeUtil.colorPick(isEmpty ? theme.state.cInactive : theme.state.cActive)}>{state}</VText>
          </VRow>
        </VModalBottom.Header>
        <VModalBottom.Body>
          <VCol pb={theme.list.sPadding?.md} ph={theme.list.sPadding?.md}>
            {Object.keys(filter).map((key) =>
              filter[key].list?.map((model, index) => {
                if (model.config.hidden) {
                  return null;
                } else if (model.config.separate) {
                  return (
                    <VRow justifyContent={'space-between'} alignItems={'center'} key={key + index}>
                      {!!model.config.title && (
                        <VText style={theme.title.fText} mr={theme.title.sMargin?.md}
                          color={VThemeUtil.colorPick(theme.title.cText)}>{model.config.title}</VText>
                      )}
                      <VInputFake flex context={{ model, key }} value={model.display}
                        onPress={modalOpen} withoutBorder textStyle={SS.inputFake} />
                    </VRow>

                  );
                } else {
                  const Component = VFilterConfig.model2component(model);
                  return <Component pv={'sm'} key={key + index} model={model} />;
                }
              }),
            )}
            <VRow>
              <VButton.Stroke flex onPress={clear} color={this.theme.color.accent1}>Снять</VButton.Stroke>
              <VButton.Fill flex ml={theme.button.sMargin?.md} onPress={apply}>Применить</VButton.Fill>
            </VRow>
          </VCol>
        </VModalBottom.Body>
      </VModalBottom>
    );
  }

  @computed
  private get _modalListRender() {
    const theme = this.theme.kit.Filter;
    const { model } = this.props;
    return Object.keys(model.config).map((key) => {
      const modal = model.modalList[key];
      const filter = modal.context?.model;
      if (!filter) return null;
      const Component = VFilterConfig.model2component(filter);
      if (!Component || !filter.config.separate) return null;

      return (
        <VModalBottom key={key} model={modal} onClose={model.modalClose}
          isSwipeClose={filter.domain.type !== EDFilterXType.Date}>
          <VModalBottom.Header pa={theme.list.sPadding?.md} pb={0}>
            <VText style={theme.list.header.fText}>{filter.config.title}</VText>
          </VModalBottom.Header>
          <VModalBottom.Body>
            <Component pa={theme.list.sPadding?.md} model={filter} inModal />
          </VModalBottom.Body>
          <VModalBottom.Footer pa={theme.button.sMargin?.md} pt={0}>
            <VButton.Fill onPress={model.modalClose} context={modal.context}>Применить</VButton.Fill>
          </VModalBottom.Footer>
        </VModalBottom>
      );
    });
  }
}

const SS = StyleSheet.create({
  inputFake: { textAlign: 'right' },
});
