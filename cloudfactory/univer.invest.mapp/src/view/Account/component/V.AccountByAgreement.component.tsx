import React from 'react';
import { observer } from 'mobx-react';
import { IVFlexProps, VCard, VCol, VIcon, VRow, VText, VTouchable } from '@invest.wl/mobile/src/view/kit';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VAccountByAgreementModel } from '@invest.wl/view/src/Account/model/V.AccountByAgreement.model';
import { IDAccountItemDTO, IDAccountQUIKItemDTO } from '@invest.wl/core/src/dto/Account';
import { ToggleX } from '@invest.wl/common/src/reactive/ToggleX';

type TAccountItem = IDAccountItemDTO | IDAccountQUIKItemDTO;

export interface IVAccountByClientProps<I extends TAccountItem> extends IVFlexProps {
  model: VAccountByAgreementModel<I>;
}

@observer
export class VAccountByAgreement<I extends TAccountItem> extends React.Component<IVAccountByClientProps<I>> {
  private _theme = IoC.get<VThemeStore>(VThemeStoreTid);

  private _toggler = new ToggleX();

  public render() {
    const { model, ...flexProps } = this.props;
    const { space, color } = this._theme;

    return (
      <VCard padding={space.lg} {...flexProps}>
        <VTouchable.Opacity onPress={this._toggler.toggle}>
          <VRow justifyContent={'space-between'}>
            <VCol flex>
              <VText color={color.muted4} font={'body19'}>{model.number}</VText>
              <VText mt={space.md} font={'body9'}>{model.name}</VText>
            </VCol>
            <VIcon name={'arrow-dropdown'} color={color.text} fontSize={24} />
          </VRow>
          {this._toggler.isOpen && (
            <VCol paddingTop={space.lg} marginTop={space.lg} borderTopWidth={1} borderColor={color.muted1}>
              {model.accountListX.list.map((account, index) => (
                <VRow key={account.id} mt={!!index ? space.md : undefined}>
                  <VText color={color.muted4} font={'body19'}>{account.identity.name}</VText>
                  <VText font={'body19'} ml={space.sm}>{account.identity.marketType}</VText>
                </VRow>
              ))}
            </VCol>
          )}
        </VTouchable.Opacity>
      </VCard>
    );
  }
}
