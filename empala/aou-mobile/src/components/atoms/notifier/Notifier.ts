import { ImageSourcePropType, StyleSheet } from 'react-native';
import { Notifier, Easing } from 'react-native-notifier';

import icon from '~/assets/images/check.png';
import { theme } from '~/theme';

type Props = {
  title: string;
  description: string;
  onHidden?: () => void;
  onPress?: () => void;
};

export const showNotification = ({
  title, description, onHidden, onPress,
}: Props): void => {
  Notifier.showNotification({
    title: title.toUpperCase(),
    description,
    duration: 5000,
    hideAnimationDuration: 400,
    showAnimationDuration: 400,
    showEasing: Easing.cubic,
    onHidden,
    onPress,
    hideOnPress: false,
    componentProps: {
      imageSource: icon as ImageSourcePropType,
      containerStyle: styles.containerStyle,
      titleStyle: styles.titleStyle,
      descriptionStyle: styles.descriptionStyle,
      imageStyle: styles.imageStyle,
    },
  });
};

const styles = StyleSheet.create({
  titleStyle: {
    color: 'white',
    fontFamily: 'Inter_700Bold',
    fontStyle: 'normal',
    fontSize: 16,
  },
  containerStyle: {
    backgroundColor: theme.colors.Black,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  descriptionStyle: {
    color: 'white',
    fontFamily: 'Inter_400Regular',
    fontStyle: 'normal',
    fontSize: 16,
  },
  imageStyle: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
});
