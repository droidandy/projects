import * as React from 'react';
import { SafeAreaView } from 'react-native';
import { styles } from './Authorized.styles';

export const Authorized: React.FC<{}> = (props: React.PropsWithChildren<{}>) => (
  <SafeAreaView key="authorized-layout" style={styles.container}>
    {props.children}
  </SafeAreaView>
);
