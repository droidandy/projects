import React from 'react';
import { observer } from 'mobx-react';
import {
  EVPinPadState, IVFlexProps, IVPinPadProps, IVPinPadResult, VCol, VIcon, VPinPad, VText,
} from '@invest.wl/mobile/src/view/kit';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { DErrorService, DErrorServiceTid } from '@invest.wl/domain/src/Error/D.Error.service';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { DSecurityConfig, DSecurityConfigTid } from '@invest.wl/domain/src/Security/D.Security.config';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { StyleSheet } from 'react-native';

export interface IVSecurityCodeProps extends Pick<IVPinPadProps, 'title' | 'confirmation' | 'buttonLeft'>, IVFlexProps {
  onFulfilled(code: string): Promise<void>;
}

@observer
export class VSecurityCode extends React.Component<IVSecurityCodeProps> {
  public static defaultProps: Partial<IVSecurityCodeProps> = {
    title: 'Введите ПИН-код',
  };
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  private _cfg = IoC.get<DSecurityConfig>(DSecurityConfigTid);
  private _errorService = IoC.get<DErrorService>(DErrorServiceTid);
  private _ref = React.createRef<VPinPad>();

  @observable public isBusy = false;

  constructor(props: IVSecurityCodeProps) {
    super(props);
    makeObservable(this);
  }

  public render() {
    const { onFulfilled, ...flexProps } = this.props;
    return (
      <VPinPad {...flexProps} ref={this._ref} disabled={this.isBusy}
        buttonNumber={this._numberButton} buttonBackspace={this._backspaceRender}
        length={this._cfg.codeLength} onFulfilled={this._onFullFilled} />
    );
  }

  public clear() {
    this._ref.current?.clear();
  }

  private _numberButton = (key: number) => {
    const theme = this.theme;

    return (
      <VCol justifyContent={'center'} alignItems={'center'}>
        <VText style={SS.number} color={theme.color.baseInvert}>{key}</VText>
        <VText mt={theme.space.sm} style={theme.font.body17} color={theme.color.muted4}>
          {this.getLetters(key)}
        </VText>
      </VCol>
    );
  };

  @computed
  private get _backspaceRender() {
    return (
      <>
        <VIcon name={'backspace'} fontSize={20} />
        <VText mt={this.theme.space.sm} font={'body13'} />
      </>
    );
  }

  private getLetters = (key: number) => {
    switch (key) {
      case 2:
        return 'А Б В Г';
      case 3:
        return 'Д Е Ж З';
      case 4:
        return 'И Й К Л';
      case 5:
        return 'М Н О П';
      case 6:
        return 'Р С Т У';
      case 7:
        return 'Ф Х Ц Ч';
      case 8:
        return 'Ш Щ Ъ Ы';
      case 9:
        return 'Ь Э Ю Я';
      default:
        return '';
    }
  };

  @action
  private _onFullFilled = async (res: IVPinPadResult) => {
    if (res.state === EVPinPadState.OK) {
      try {
        this.isBusy = true;
        await this.props.onFulfilled(res.code);
      } finally {
        runInAction(() => (this.isBusy = false));
      }
    } else if (res.state === EVPinPadState.ERROR) {
      this._ref.current?.clear();
      throw this._errorService.businessHandle('ПИН-код не совпадает');
    }
  };
}

const SS = StyleSheet.create({
  number: {
    fontFamily: 'Gilroy-SemiBold',
    fontSize: 34,
    lineHeight: 41,
  },
});
