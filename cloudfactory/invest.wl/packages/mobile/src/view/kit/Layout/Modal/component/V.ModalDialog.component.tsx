import { ReactUtils } from '@effectivetrade/effective-mobile/src/view/reactUtils/reactUtils.helper';
import { VModalModel } from '@invest.wl/common';
import { IoC, TObject } from '@invest.wl/core';
import { VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { ScrollView } from 'react-native';
import { isIphoneXGeneration, VThemeUtil } from '../../../../Theme/V.Theme.util';
import { IVButtonCloseProps, VButton } from '../../../Input/Button';
import { IVTextProps, VText } from '../../../Output/Text';
import { IVFlexProps, VCol, VRow } from '../../Flex';

import { IVModalInternalProps } from '../V.Modal.types';
import { VModal } from './V.Modal.component';

export interface IVModalDialogProps<T = any> extends Omit<IVFlexProps, 'children'>, IVModalInternalProps<T> {
  readonly model?: VModalModel<TObject<T>, T>;
}

const MAX_HEIGHT_DIALOG = isIphoneXGeneration() ? '90%' : '95%';

@observer
export class VModalDialog extends React.Component<IVModalDialogProps> {
  public static Title = (_: IVTextProps) => null;
  public static Text = (_: IVTextProps) => null;
  public static Content = (_: IVFlexProps) => null;
  public static Actions = (_: IVFlexProps) => null;
  public static ButtonClose = (_: IVButtonCloseProps<any>) => null;

  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  constructor(props: IVModalDialogProps) {
    super(props);
    makeObservable(this);
  }

  public render() {
    const theme = this.theme.kit.ModalDialog;
    const { children, ...props } = this.props;
    const innerProps = this._props;

    return (
      <VModal {...props} maxHeight={MAX_HEIGHT_DIALOG}>
        <VCol bg={VThemeUtil.colorPick(theme.cBg)} radius={theme.sRadius?.md} overflow={'hidden'}>
          {!!innerProps.closeButton && (
            <VButton.Close absolute top={theme.close.sMargin?.md}
              right={theme.close.sMargin?.md} {...innerProps.closeButton} />
          )}

          <ScrollView showsVerticalScrollIndicator={false} alwaysBounceVertical={false}>
            {!!innerProps.title && (
              <VText ta={'center'} color={VThemeUtil.colorPick(theme.title.cText)}
                style={theme.title.fText} {...innerProps.title} />
            )}
            {!!innerProps.text && (
              <VText color={VThemeUtil.colorPick(theme.text.cText)} style={theme.text.fText} {...innerProps.text} />)}
            {!!innerProps.content && (<VCol {...innerProps.content} />)}
            {children}
          </ScrollView>
          {!!innerProps.actions && (<VRow {...innerProps.actions} />)}
        </VCol>
      </VModal>
    );
  }

  @computed
  private get _props() {
    let title: Parameters<typeof VModalDialog.Title>[0] | undefined;
    let text: Parameters<typeof VModalDialog.Text>[0] | undefined;
    let content: Parameters<typeof VModalDialog.Content>[0] | undefined;
    let actions: Parameters<typeof VModalDialog.Content>[0] | undefined;
    let closeButton: Parameters<typeof VModalDialog.ButtonClose>[0] | undefined;
    for (const el of ReactUtils.filterElements(this.props.children)) {
      if (el.type === VModalDialog.Title) title = el.props;
      else if (el.type === VModalDialog.Text) text = el.props;
      else if (el.type === VModalDialog.ButtonClose) closeButton = el.props;
      else if (el.type === VModalDialog.Content) content = el.props;
      else if (el.type === VModalDialog.Actions) actions = el.props;
    }

    return { content, title, text, actions, closeButton };
  }
}
