import { ImageStyle, StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { theme } from '../../helpers/theme';

const itemMargin = theme.sizing(3);

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: -itemMargin,
  },
  content: {
    paddingVertical: theme.screenPadding.vertical,
  },
  containerLoader: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemLabel: {
    fontSize: 16,
    flexShrink: 0,
    padding: theme.sizing(2),
    textAlign: 'center',
  },
});

export const getItemStyles = (windowWidth: number): StyleProp<ViewStyle> => {
  const usableWidth = windowWidth - theme.screenPadding.horizontal * 2;
  const borderWidth = 2;
  const sizes = usableWidth / 2 - itemMargin / 2 - borderWidth;

  return {
    width: sizes,
    height: sizes,
    marginBottom: itemMargin,
    flexShrink: 0,
    flexDirection: 'column',
    alignItems: 'center',
    borderWidth,
    borderColor: theme.green,
    borderRadius: 8,
    backgroundColor: '#fff',
  };
};

export const getImageStyles = (windowWidth: number): StyleProp<ImageStyle> => {
  const usableWidth = windowWidth - theme.screenPadding.horizontal * 2;
  const borderWidth = 2;
  const itemSizes = usableWidth / 2 - itemMargin / 2 - borderWidth;
  const sizes = itemSizes - theme.sizing(2) * 4 - theme.sizing(1) - 20;

  return {
    width: sizes,
    height: sizes,
    marginTop: theme.sizing(2),
  };
};
