import { CompoundUtils } from '@effectivetrade/effective-mobile/src/view/CompoundUtils/Compound.component';
import { ToggleX } from '@invest.wl/common';
import { IoC } from '@invest.wl/core';
import { VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import { observer } from 'mobx-react';
import * as React from 'react';
import { themeStyle, VThemeUtil } from '../../../Theme/V.Theme.util';
import { VButton } from '../../Input/Button';
import { VTouchable } from '../../Input/Touchable';
import { IVFlexProps, VCol, VRow } from '../../Layout/Flex';
import { VModalDialog } from '../../Layout/Modal/component/V.ModalDialog.component';
import { VIcon } from '../Icon';
import { IVIconViewProps } from '../Icon/V.Icon.types';

interface Props extends IVFlexProps {
  text: string;
  viewIconHide?: boolean;
}

@observer
export class VTooltip extends React.Component<Props> {
  public static HintIcon = (_: Partial<IVIconViewProps>) => null;
  public static View = (_: IVFlexProps) => null;

  private theme = IoC.get<VThemeStore>(VThemeStoreTid);
  public toggler = new ToggleX();

  public render() {
    const { text, width, height, children, viewIconHide, ...rest } = this.props;
    const theme = this.theme.kit.Tooltip;

    return (
      <VRow {...rest}>
        <CompoundUtils.Find peers={children} byPeerType={VTooltip.View}>{e => !!e && (
          <VTouchable.Opacity onLongPress={this.toggler.open}>
            <VRow>
              <VCol marginRight={theme.sMargin?.md} {...e.props} />
              {!viewIconHide && (
                <VIcon marginTop={theme.icon.sMargin?.md} name={'info'} fontSize={theme.icon.sFont?.md}
                  color={VThemeUtil.colorPick(theme.icon.cMain)}
                  hitSlop={themeStyle.hitSlop16} />
              )}
            </VRow>
          </VTouchable.Opacity>
        )}
        </CompoundUtils.Find>
        <CompoundUtils.Find peers={children} byPeerType={VTooltip.HintIcon}>{e => !!e && (
          <VTouchable.Opacity onLongPress={this.toggler.open}>
            <VIcon mt={theme.icon.sMargin?.md} name={'info'} fontSize={theme.icon.sFont?.md}
              color={VThemeUtil.colorPick(theme.icon.cMain)} hitSlop={themeStyle.hitSlop16}
              {...e.props} />
          </VTouchable.Opacity>
        )}</CompoundUtils.Find>
        <VModalDialog isVisible={this.toggler.isOpen} onClose={this.toggler.close}>
          <VModalDialog.Text style={theme.text.fText} ma={theme.text.sPadding?.md} text={text} />
          <VModalDialog.Actions>
            <VButton.Fill onPress={this.toggler.close}>Ок</VButton.Fill>
          </VModalDialog.Actions>
        </VModalDialog>
      </VRow>
    );
  }
}
