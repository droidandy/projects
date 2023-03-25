import React, { PropsWithChildren } from 'react';
import { RefreshControlProps, ScrollView, StyleProp, View, ViewStyle } from 'react-native';
import { BottomNavigation } from '../../../components/BottomNavigation/BottomNavigation';
import { styles } from './DataContainer.styles';
import { InnerShadow } from '../../../components/inner-shadow';

type DataContainerProps = PropsWithChildren<{
  contentStyle?: ViewStyle;
  scrollContentStyle?: StyleProp<ViewStyle>;
  footerTopAdornment?: React.ReactNode;
  refreshControl?: React.ReactElement<RefreshControlProps>;
}>;

const DataContainerBase = ({
  children,
  contentStyle,
  footerTopAdornment,
  scrollContentStyle,
  refreshControl,
}: DataContainerProps) => (
  <React.Fragment key="container">
    <View key="wrapper" style={styles.container}>
      <ScrollView
        key="scroll"
        style={styles.container}
        contentContainerStyle={scrollContentStyle}
        refreshControl={refreshControl}
      >
        <View key="content" style={[styles.content, contentStyle]}>
          {children}
        </View>
      </ScrollView>
      <InnerShadow />
    </View>
    <View key="footer" style={styles.footer}>
      <View key="top-adornment" style={styles.footerTopAdornment}>
        {footerTopAdornment}
      </View>
      <BottomNavigation key="bottom-navigation" />
    </View>
  </React.Fragment>
);

export const DataContainer2 = ({
  children,
  contentStyle,
  footerTopAdornment,
}: DataContainerProps) => (
  <React.Fragment key="container">
    <View key="wrapper" style={styles.container}>
      <View key="content" style={[styles.content, contentStyle]}>
        {children}
      </View>
    </View>
    <View key="footer" style={styles.footer}>
      <View key="top-adornment" style={styles.footerTopAdornment}>
        {footerTopAdornment}
      </View>
      <BottomNavigation key="bottom-navigation" />
    </View>
  </React.Fragment>
);

export const DataContainer = React.memo(DataContainerBase);
