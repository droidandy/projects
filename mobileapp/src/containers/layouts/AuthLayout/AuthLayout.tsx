import React, { PropsWithChildren } from 'react';
import { View, SafeAreaView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Image } from '../../../components/Image/Image';
import { Title } from '../../../components/text/Title/Title';

import { styles } from './AuthLayout.style';
import IMAGES from '../../../resources';

interface Props extends PropsWithChildren<{}> {
  title?: string;
  hideScreenPadding?: boolean;
}

export const AuthLayout: React.FC<Props> = ({ title, hideScreenPadding, children }: Props) => {
  return (
    <SafeAreaView style={hideScreenPadding ? styles.safeAreaViewNoPadding : styles.safeAreaView}>
      <View key="space-top" style={styles.spaceTop} />
      <Image key="logo" source={IMAGES.logo} style={styles.logo} />
      {title ? <Title key="title" style={styles.title} text={title} /> : null}
      <View key="content" style={styles.content}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.kav}
          extraScrollHeight={12}
          enableAutomaticScroll={true}
          enableOnAndroid={true}
        >
          {children}
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};
