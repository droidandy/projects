import * as React from 'react';
import {
  LayoutChangeEvent,
  PixelRatio,
  StyleSheet,
  Text,
  TextStyle,
  TouchableHighlight,
  TouchableHighlightProps,
  View,
  ViewStyle,
} from 'react-native';

import Dash from 'react-native-dash';

import { theme } from '../../../helpers/theme';
import { useNavigation } from '../../../hooks/navigation';

import { linkStyles } from './Link.style';

export interface LinkProps extends TouchableHighlightProps {
  title: string;
  link: string;
  underline?: 'dash' | 'none';
  textStyle?: TextStyle;
  startAdornment?: React.ReactNode | null;
  endAdornment?: React.ReactNode | null;
  style?: ViewStyle;
}

export const Link: React.FC<LinkProps> = ({
  title,
  link,
  style,
  underline,
  textStyle,
  startAdornment,
  endAdornment,
  ...rest
}: LinkProps) => {
  const [width, setWidth] = React.useState(100);
  const navigation = useNavigation();
  const linkAction = (target: string) => {
    if (target === 'back') {
      navigation.goBack();
    } else {
      navigation.navigate(target);
    }
  };

  return (
    <View key="container" style={[linkStyles.view, style]}>
      <TouchableHighlight
        key="touchable"
        underlayColor="transparent"
        activeOpacity={theme.opacity.active}
        onPress={() => linkAction(link)}
        {...rest}
      >
        <View
          key="items"
          style={linkStyles.items}
          onLayout={(layout: LayoutChangeEvent): void => setWidth(layout.nativeEvent.layout.width)}
        >
          {startAdornment}
          <Text key="text" allowFontScaling={false} style={[linkStyles.text, textStyle]}>
            {title}
          </Text>
          {endAdornment}
        </View>
      </TouchableHighlight>
      {underline === 'dash' ? (
        <Dash
          key="underline-dash"
          style={{ width, height: PixelRatio.get() }}
          dashGap={PixelRatio.get()}
          dashLength={2 * PixelRatio.get()}
          dashThickness={StyleSheet.hairlineWidth}
          dashColor={theme.green}
        />
      ) : null}
    </View>
  );
};

Link.defaultProps = {
  underline: 'dash',
  startAdornment: null,
  endAdornment: null,
} as Partial<LinkProps>;
