import React from 'react';
import Dash from 'react-native-dash';
import { PixelRatio, View } from 'react-native';

import { theme } from '../../helpers/theme';
import useDimensions from '../../hooks/dimensions';

import { styles } from './SeparatorDash.styles';

const SeparatorDashBase: React.FC = () => {
  const dimensions = useDimensions();
  const pixelRatio = PixelRatio.get();

  return (
    <View key="items" style={styles.container}>
      <Dash
        key="dash"
        dashGap={2}
        dashLength={2}
        style={{ width: dimensions.window.width - theme.screenPadding.horizontal * 2 }}
        dashColor={theme.lightGray}
        dashThickness={1}
      />
    </View>
  );
};

export const SeparatorDash = React.memo<{}>(SeparatorDashBase, () => true);
