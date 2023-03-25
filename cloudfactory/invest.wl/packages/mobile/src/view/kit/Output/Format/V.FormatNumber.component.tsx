import { ReactUtils } from '@effectivetrade/effective-mobile/src/view/reactUtils/reactUtils.helper';
import { CompoundUtils } from '@effectivetrade/effective-mobile/src/view/CompoundUtils/Compound.component';
import { IoC } from '@invest.wl/core';
import { TVThemeSizeBase, VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { VThemeUtil } from '../../../Theme/V.Theme.util';
import { IVTextProps, VText } from '../Text';
import { VFormatProps } from './V.Format.types';

export interface VFormatNumberProps extends VFormatProps, IVTextProps {
  size?: TVThemeSizeBase;
  children: string;
}

@observer
export class VFormatNumber extends React.Component<VFormatNumberProps> {
  public static defaultProps = {
    size: 'md',
  };
  public static Int = (_: IVTextProps) => null;

  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  constructor(props: VFormatNumberProps) {
    super(props);
    makeObservable(this);
  }

  @computed
  private get data() {
    const [num, currency] = this._number.split(/\s(?=\D*$)/);
    const [int, float] = num.split(/[,.]/);

    return {
      int,
      float: float ? ',' + float : '',
      currency: currency ?? '',
    };
  }

  public render() {
    const { children, size, ...flexProps } = this.props;
    const { int, float, currency } = this.data;
    const theme = this.theme.kit.Format.Number;
    const floatSS = theme.float[size!];
    const intSS = theme.int[size!];
    return (
      <VText style={floatSS?.fText} color={VThemeUtil.colorPick(floatSS?.cText)} {...flexProps}>
        <CompoundUtils.Find peers={children} byPeerType={VFormatNumber.Int}>{e => (
          <VText style={intSS?.fText} color={VThemeUtil.colorPick(intSS?.cText)} {...e?.props}>{int}</VText>
        )}</CompoundUtils.Find>
        {float + (currency ? ' ' + currency : '')}
      </VText>
    );
  }

  @computed
  private get _number() {
    for (const c of ReactUtils.toIterable(this.props.children)) {
      if (c && typeof c === 'string') return c as string;
    }
    return '';
  }
}
