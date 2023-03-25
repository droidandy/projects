import React, { PropsWithChildren } from 'react';
import { FlatList, FlatListProps, View } from 'react-native';
import { BottomNavigation } from '../../../components/BottomNavigation/BottomNavigation';

import { styles } from './FlatDataContainer.styles';

interface Props<T> extends FlatListProps<T> {
  footerTopAdornment?: React.ReactNode;
}

type P = PropsWithChildren<Props<any>>;

export const FlatDataContainer = React.forwardRef<FlatList, P>((props: P, ref) => {
  const { style, children, footerTopAdornment, ...flatProps } = props;
  return (
    <View key="container" style={[styles.container, style]}>
      <FlatList {...flatProps} key="list" contentContainerStyle={styles.list} ref={ref} />
      {children}
      <View key="footer" style={styles.footer}>
        <View key="top-adornment" style={styles.footerTopAdornment}>
          {footerTopAdornment}
        </View>
        <BottomNavigation key="bottom-navigation" />
      </View>
    </View>
  );
});
FlatDataContainer.displayName = 'FlatDataContainer';
