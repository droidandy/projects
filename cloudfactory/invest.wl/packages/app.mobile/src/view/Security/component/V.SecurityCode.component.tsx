import { IoC } from '@invest.wl/core';
import { DErrorService, DErrorServiceTid } from '@invest.wl/domain/src/Error/D.Error.service';
import { DSecurityConfig, DSecurityConfigTid } from '@invest.wl/domain/src/Security/D.Security.config';
import { EVPinPadState, IVFlexProps, IVPinPadProps, IVPinPadResult, VPinPad } from '@invest.wl/mobile';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';

export interface IVSecurityCodeProps extends Pick<IVPinPadProps, 'title' | 'confirmation' | 'buttonLeft'>, IVFlexProps {
  onFulfilled(code: string): Promise<void>;
}

@observer
export class VSecurityCode extends React.Component<IVSecurityCodeProps> {
  public static defaultProps: Partial<IVSecurityCodeProps> = {
    title: 'Введите ПИН-код',
  };
  // private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  private _cfg = IoC.get<DSecurityConfig>(DSecurityConfigTid);
  private _errorService = IoC.get<DErrorService>(DErrorServiceTid);
  private _ref = React.createRef<VPinPad>();

  @observable public isBusy = false;

  constructor(props: IVSecurityCodeProps) {
    super(props);
    makeObservable(this);
  }

  public render() {
    const { onFulfilled, ...props } = this.props;
    return (
      <VPinPad {...props} mt={2} ref={this._ref} disabled={this.isBusy}
        // buttonNumber={this._numberButton} buttonBackspace={this._backspaceRender}
        length={this._cfg.codeLength} onFulfilled={this._onFullFilled} />
    );
  }

  public clear() {
    this._ref.current?.clear();
  }

  // private _numberButton = (key: number) => {
  //   const theme = this.theme;
  //
  //   return (
  //     <VCol justifyContent={'center'} alignItems={'center'}>
  //       <VText font={'body2'} color={theme.color.base}>{key}</VText>
  //       <VText mt={theme.space.sm} style={theme.font.body13} color={theme.color.base}>
  //         {this.getLetters(key)}
  //       </VText>
  //     </VCol>
  //   );
  // };
  //
  // @computed
  // private get _backspaceRender() {
  //   return (
  //     <>
  //       <VIcon name={'backspace'} fontSize={20} />
  //       <VText mt={this.theme.space.sm} font={'body13'} />
  //     </>
  //   );
  // }

  // private getLetters = (key: number) => {
  //   switch (key) {
  //     case 2:
  //       return 'АБВГ';
  //     case 3:
  //       return 'ДЕЖЗ';
  //     case 4:
  //       return 'ИЙКЛ';
  //     case 5:
  //       return 'МНОП';
  //     case 6:
  //       return 'РСТУ';
  //     case 7:
  //       return 'ФХЦЧ';
  //     case 8:
  //       return 'ШЩЪЫ';
  //     case 9:
  //       return 'ЬЭЮЯ';
  //     default:
  //       return '';
  //   }
  // };

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
