import { IoC } from '@invest.wl/core';
import { IVFlexProps, VCard, VIcon, VRow, VText, VThumbnail, VTouchable } from '@invest.wl/mobile';
import { VInvestIdeaItemModel } from '@invest.wl/view/src/InvestIdea/model/V.InvestIdeaItem.model';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { observer } from 'mobx-react';
import React from 'react';

export interface IVInvestIdeaCardProps extends IVFlexProps {
  model: VInvestIdeaItemModel;
  onPress?(m: VInvestIdeaItemModel): void;
}

@observer
export class VInvestIdeaCard extends React.Component<IVInvestIdeaCardProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  public render() {
    const { space } = this.theme;
    const { model, onPress, ...flexProps } = this.props;

    return (
      <VCard pa={space.md} minWidth={92} {...flexProps}>
        <VTouchable.Opacity context={model} onPress={onPress}>
          {!!model.instrumentIdentity && (
            <>
              <VThumbnail uri={model.instrumentIdentity.imageSrc} width={24} height={24} radius={12} />
              <VText mt={space.md} font={'body19'} runningLine>{model.instrumentIdentity.name}</VText>
            </>
          )}
          {!model.instrumentIdentity && (
            <>
              <VThumbnail uri={model.identity.imageSrc} width={24} height={24} radius={12} />
              <VText mt={space.md} font={'body19'} runningLine>{model.identity.title}</VText>
            </>
          )}
          <VRow mt={space.xs}>
            <VIcon name={model.directionIcon} fontSize={16} color={model.directionColor} />
            <VText font={'body21'} color={model.directionColor}>{model.profit}</VText>
          </VRow>
        </VTouchable.Opacity>
      </VCard>
    );
  }
}
