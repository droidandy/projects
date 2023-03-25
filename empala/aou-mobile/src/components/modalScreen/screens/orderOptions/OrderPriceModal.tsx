import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useCallback } from 'react';

import * as s from './orderOptionsModalStyles';

import { Routes } from '~/app/home/navigation/routes';
import { RootStackParamList } from '~/app/home/navigation/types';
import { OrderOptionsData } from '~/app/home/types/trade';
import { Button } from '~/components/atoms/button';
import { Modals } from '~/constants/modalScreens';

type NavigationProps = StackNavigationProp<RootStackParamList, Routes.ModalScreen>;
type Props = {
  defaultValue: OrderOptionsData,
  navigation: NavigationProps,
  backScreen: Routes,
};

export const OrderPriceModal = ({ defaultValue, navigation, backScreen }: Props): JSX.Element => {
  const [userPrice, setUserPrice] = useState(String(defaultValue?.userPrice || ''));

  const proceed = useCallback(() => {
    navigation.navigate(Routes.ModalScreen, {
      activeModal: Modals.OrderOptions,
      defaultValues: { orderOptions: { ...defaultValue, userPrice: Number(userPrice) } },
      backScreen: Routes.BuyOrSell,
    });
  }, [defaultValue, backScreen, navigation, userPrice]);

  return (
    <s.Container behavior="padding">
      <s.InputSubtitle>All you need is Love!</s.InputSubtitle>
      <s.RowAlignRight marginTop={9}>
        <s.Dollar>$</s.Dollar>
        <s.Input
          value={userPrice}
          onChangeText={setUserPrice}
          placeholder="0"
          placeholderTextColor="white"
          keyboardType="numeric"
        />
      </s.RowAlignRight>
      <s.Btn>
        <Button
          title="Continue"
          face="blue"
          onPress={proceed}
        />
      </s.Btn>
    </s.Container>
  );
};
