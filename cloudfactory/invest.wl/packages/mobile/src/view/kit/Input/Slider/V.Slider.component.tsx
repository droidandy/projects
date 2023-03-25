import { IoC } from '@invest.wl/core';
import { VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import RNSlider, { SliderProps } from '@react-native-community/slider';
import React from 'react';
import { VThemeUtil } from '../../../Theme/V.Theme.util';

import { IVFlexProps } from '../../Layout/Flex';
import { flexView } from '../../Layout/Flex/V.Flex.util';

interface IVSliderProps extends SliderProps, IVFlexProps {
  ref?: any;
}

@flexView()
export class VSlider extends React.Component<IVSliderProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  public render() {
    const theme = this.theme.kit.Slider;
    return (
      <RNSlider
        thumbTintColor={VThemeUtil.colorPick(theme.cMain)}
        minimumTrackTintColor={VThemeUtil.colorPick(theme.cPositive)}
        maximumTrackTintColor={VThemeUtil.colorPick(theme.cNegative)}
        {...this.props}
      />
    );
  }
}
