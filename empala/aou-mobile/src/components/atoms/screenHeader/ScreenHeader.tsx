import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ButtonWithIcon } from '~/components/atoms/buttonWithIcon';
import { theme } from '~/theme';

export const ScreenHeader = (): JSX.Element => {
  const navigation = useNavigation();

  return (
    (
      <SafeAreaView
        edges={['top', 'bottom']}
        style={styles.wrapper}
      >
        <ButtonWithIcon
          icon="backArrow"
          color={theme.colors.Black}
          onPress={() => navigation.goBack()}
        />
      </SafeAreaView>
    )
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: 30,
    width: '100%',
    overflow: 'hidden',
    paddingLeft: 17,
  },
});
