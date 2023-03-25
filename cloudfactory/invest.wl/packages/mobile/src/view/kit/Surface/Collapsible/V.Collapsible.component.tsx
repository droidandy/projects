import { ToggleX } from '@invest.wl/common';
import { IoC } from '@invest.wl/core';
import { VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { VThemeUtil } from '../../../Theme/V.Theme.util';
import { VTouchable } from '../../Input/Touchable';
import { IVFlexProps, VCol, VRow } from '../../Layout/Flex';
import { VIcon } from '../../Output/Icon';
import { VText } from '../../Output/Text';

interface IVCollapsibleProps<C> extends IVFlexProps {
  readonly title: string;
  readonly isOpened?: boolean;
  readonly context?: C;
  onChange?(isOpened: boolean, context?: C): void;
}

@observer
export class VCollapsible<C> extends React.Component<IVCollapsibleProps<C>> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  public toggler = new ToggleX(false);

  constructor(props: IVCollapsibleProps<C>) {
    super(props);
    makeObservable(this);
  }

  public componentDidUpdate(prevProps: IVCollapsibleProps<C>) {
    if (this.props.isOpened != null && this.props.isOpened !== prevProps.isOpened) {
      this.toggler.toggle(this.props.isOpened);
    }
  }

  public render() {
    const { title, children, ...rest } = this.props;
    const theme = this.theme.kit.Collapsible;
    const isCollapsed = !this.toggler.isOpen;
    return (
      <VCol>
        <VTouchable.Opacity onPress={this._onPress}>
          <VRow flex justifyContent={'space-between'} alignItems={'center'} height={theme.sHeight?.md} {...rest}>
            <VText style={theme.button.fText} color={VThemeUtil.colorPick(theme.button.cText)}>
              {title}
            </VText>
            <VIcon name={'arrow-dropdown'} style={this._iconStyle} fontSize={theme.icon.sFont?.md}
              color={VThemeUtil.colorPick(theme.icon.cMain)} />
          </VRow>
        </VTouchable.Opacity>
        {!isCollapsed && children}
      </VCol>
    );
  }

  @computed
  private get _iconStyle() {
    return this.toggler.isOpen ? { transform: [{ rotateZ: '180deg' }] } : {};
  }

  private _onPress = () => {
    this.toggler.toggle();
    this.props.onChange?.(this.toggler.isOpen, this.props.context);
  };
}
