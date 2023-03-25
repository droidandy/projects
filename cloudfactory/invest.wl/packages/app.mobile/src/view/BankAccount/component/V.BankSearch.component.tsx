import { ToggleX } from '@invest.wl/common/src/reactive/ToggleX';
import { delayPromise } from '@invest.wl/common/src/util/async.util';
import { DisposableHolder } from '@invest.wl/common/src/util/disposable.util';

import { IoC } from '@invest.wl/core';
import { VButton, VCol, VInputField, VList, VModalBottom, VText, VTouchable } from '@invest.wl/mobile';
import { IVBankModel } from '@invest.wl/view/src/BankAccount/model/V.Bank.model';
import { VBankSearchPresent, VBankSearchPresentTid } from '@invest.wl/view/src/BankAccount/present/V.BankSearch.present';
import { colors } from '_view/Theme/value/colors';
import { action, makeObservable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleSheet, TextInput } from 'react-native';

export interface IVBankSearchProps {
  disabled?: boolean;
  initialValue: string;
  onSelect(item: IVBankModel): void;
}

@observer
export class VBankSearch extends React.Component<IVBankSearchProps> {
  private _pr = IoC.get<VBankSearchPresent>(VBankSearchPresentTid);
  private _toggler = new ToggleX();
  private _inputRef = React.createRef<TextInput>();
  private _dh = new DisposableHolder();

  constructor(props: IVBankSearchProps) {
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

    return (
      <VCol>
        <TextInput caretHidden ref={this._inputRef} style={SS.backgroundInputText} />
        <VTouchable.Opacity onPress={this._onModalOpen} disabled={disabled}>
          {children}
        </VTouchable.Opacity>
        <VModalBottom
          isVisible={this._toggler.isOpen} onClose={this._toggler.close} isSwipeClose
          isFullScreen isEditableContent>
          <VModalBottom.Header pa={'lg'}>
            <VText mb={'lg'} font={'body16'} color={colors.baseContrast}>БИК</VText>
            <VInputField error={text.displayErrors}>
              <VInputField.Input autoFocus keyboardType={'number-pad'}
                value={text.value} {...text.inputEvents} />
            </VInputField>
          </VModalBottom.Header>
          <VModalBottom.Body>
            <VCol flex>
              {this._pr.listX.list.map(this._renderItem)}
            </VCol>
          </VModalBottom.Body>
          <VModalBottom.Footer>
            <VCol pt={'lg'} pb={'lg'} absolute bottom left right bg={colors.base}>
              <VButton.Stroke mh={'lg'} onPress={this._toggler.close} flex>Отменить</VButton.Stroke>
            </VCol>
          </VModalBottom.Footer>
        </VModalBottom>
      </VCol>
    );
  }

  private _renderItem = (model: IVBankModel) => {
    return (
      <VTouchable.Opacity key={model.id} context={model} onPress={this._onSelect}>
        <VText mt={'sm'} font={'body11'} color={colors.decorGray}>
          БИК ${model.bik} {model.name}, ИНН {model.name || ''}
        </VText>
        <VList.Separator />
      </VTouchable.Opacity>
    );
  };

  private _onSelect = (item: IVBankModel) => {
    this.props.onSelect(item);
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
  backgroundInputText: {
    position: 'absolute',
  },
});
