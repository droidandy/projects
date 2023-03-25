import { ToggleX } from '@invest.wl/common/src/reactive/ToggleX';
import { delayPromise } from '@invest.wl/common/src/util/async.util';
import { DisposableHolder } from '@invest.wl/common/src/util/disposable.util';
import { IDAddressDTO, IoC } from '@invest.wl/core';
import { VButton, VCol, VInputField, VList, VModalBottom, VRow, VText, VTouchable } from '@invest.wl/mobile';
import { IVAddressModel } from '@invest.wl/view/src/Address/model/V.Address.model';
import { VAddressSearchPresent, VAddressSearchPresentTid } from '@invest.wl/view/src/Address/present/V.AddressSearch.present';
import { action, computed, makeObservable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { Platform, StyleSheet, TextInput } from 'react-native';
import { colors } from '../../Theme/value/colors';
import { textStyles } from '../../Theme/value/textStyles';

export interface IVAddressSearchProps {
  title?: string;
  disabled?: boolean;
  initialValue: string;
  onSelect(address: IDAddressDTO): void;
  onInput(value: string): void;
}

@observer
export class VAddressSearch extends React.Component<IVAddressSearchProps> {
  private _pr = IoC.get<VAddressSearchPresent>(VAddressSearchPresentTid);
  private _toggler = new ToggleX();
  private _inputRef = React.createRef<TextInput>();
  private _dh = new DisposableHolder();
  private _lastAddress?: IVAddressModel;

  constructor(props: IVAddressSearchProps) {
    super(props);
    makeObservable(this);
  }


  public componentDidMount() {
    this._dh.push(reaction(
      () => this._toggler.isOpen,
      isOpen => !isOpen ?? this._inputRef.current?.blur(),
    ));
  }

  public componentWillUnmount() {
    this._dh.dispose();
  }

  public render() {
    const { children, disabled } = this.props;
    const { text } = this._pr.searchModel.fields;

    const title = this.props.title ?? 'Адрес регистрации';

    return (
      <VCol>
        <TextInput caretHidden ref={this._inputRef} style={SS.backgroundInputText} />
        <VTouchable.Opacity disabled={disabled} onPress={this._onModalOpen}>
          {children}
        </VTouchable.Opacity>
        <VModalBottom isVisible={this._toggler.isOpen} onClose={this._toggler.close}
          isSwipeClose isFullScreen isEditableContent>
          <VModalBottom.Header ph={'lg'} pt={'lg'}>
            <VText font={'body16'}>{title}</VText>
            <VInputField mt={'md'} error={text.displayErrors}>
              <VInputField.Input autoFocus multiline value={text.value}
                {...text.inputEvents} />
            </VInputField>
          </VModalBottom.Header>
          <VModalBottom.Body>
            <VCol flex ph={'lg'}>
              {this._pr.listX.list.map(this._renderItem)}
            </VCol>
          </VModalBottom.Body>
          <VModalBottom.Footer pt={20} ph={20} pb={this._bottomButtonsPadding}>
            <VRow>
              <VButton.Fill flex mr={'md'} context={text.value} onPress={this._submitAddressInput}>
                Применить
              </VButton.Fill>
              <VButton.Stroke flex onPress={this._toggler.close}>Отменить</VButton.Stroke>
            </VRow>
          </VModalBottom.Footer>
        </VModalBottom>
      </VCol>
    );
  }

  @computed
  private get _bottomButtonsPadding() {
    return Platform.OS === 'ios' ? 0 : 20;
  }

  private _renderItem = (model: IVAddressModel) => {
    // const searchWords = this._pr.searchModel.fields.text.value?.split(new RegExp('[()\\\\ ]', 'g')) ?? [];
    return (
      <VTouchable.Opacity key={model.id} context={model} onPress={this._onSelect}>
        {/* <Highlighter */}
        {/*  style={SS.nonEnteredText} */}
        {/*  highlightStyle={SS.enteredText} */}
        {/*  searchWords={searchWords} */}
        {/*  textToHighlight={model.vAddressLocal} */}
        {/* /> */}
        <VText mt={'sm'} font={'body16'} color={colors.decorGray}>
          {model.full}
        </VText>
        <VList.Separator />
      </VTouchable.Opacity>
    );
  };

  private _onSelect = (item: IVAddressModel) => {
    this._lastAddress = item;
    this._pr.searchModel.fields.text.onChangeText(this._lastAddress.full);
  };

  private _submitAddressInput = (value?: string) => {
    if (!!this._lastAddress && this._lastAddress.full === value) this.props.onSelect(this._lastAddress.domain.dto);
    else this.props.onInput(value ?? '');
    this._toggler.close();
  };

  @action
  private _onModalOpen = async () => {
    this._inputRef.current?.focus();
    this._inputRef.current?.blur();
    this._pr.searchModel.fields.text.onChangeText(this.props.initialValue);
    await delayPromise(150);
    this._toggler.open();
  };
}

const SS = StyleSheet.create({
  enteredText: {
    ...textStyles['semibold16'],
  },
  nonEnteredText: {
    color: colors.baseContrast,
    ...textStyles['regular16x140'],
  },
  backgroundInputText: {
    position: 'absolute',
  },
});
