import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet } from 'react-native';

import { Routes } from '~/app/home/navigation/routes';
import { TradeParamList } from '~/app/home/navigation/types';
import { ButtonWithIcon } from '~/components/atoms/buttonWithIcon';

type Props = {
  navigation: NativeStackNavigationProp<TradeParamList, Routes.TradeNavigator>;
  route: RouteProp<TradeParamList, Routes.BuyOrSell>;
};

export const BackButton = ({ route, navigation }: Props): JSX.Element => (
  <ButtonWithIcon
    icon="backArrow"
    color="black"
    text={route.params?.data?.companyName}
    textStyle={styles.headerBackTitle}
    onPress={() => navigation.goBack()}
  />
);

const styles = StyleSheet.create({
  headerBackTitle: {
    paddingLeft: 12,
  },
});
