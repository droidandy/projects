import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useEffect, useCallback } from 'react';

import * as s from './orderOptionsModalStyles';

import { Routes } from '~/app/home/navigation/routes';
import { RootStackParamList } from '~/app/home/navigation/types';
import { OrderOptionsData, OrderType, TimeInForce } from '~/app/home/types/trade';
import { SwitchSelector } from '~/components/atoms/switchSelector';
import { useModal } from '~/components/modalScreen/useModal';
import { Modals } from '~/constants/modalScreens';

type NavigationProps = StackNavigationProp<RootStackParamList, Routes.ModalScreen>;
type Props = {
  defaultValue: OrderOptionsData | undefined,
  navigation: NavigationProps,
  backScreen: keyof RootStackParamList,
};

export const OrderOptionsModal = ({ defaultValue, navigation, backScreen }: Props): JSX.Element => {
  const [orderType, setOrderType] = useState<OrderType | undefined>(defaultValue?.orderType);
  const [extendedHours, setExtendedHours] = useState(defaultValue?.extendedHours || false);
  const [timeInForce, setTimeInForce] = useState<TimeInForce>(defaultValue?.timeInForce || TimeInForce.Day);
  const [userPrice, setUserPrice] = useState(defaultValue?.userPrice || 0);

  const [{ selectedValue }, showModal] = useModal();

  useEffect(
    () => {
      const unsubscribe = navigation.addListener('beforeRemove', (event) => {
        event.preventDefault();
        navigation.navigate(backScreen, {
          selectedValue: {
            orderOptions: {
              ...defaultValue,
              orderType,
              extendedHours,
              timeInForce,
              userPrice,
            },
          },
        });
      });
      return unsubscribe;
    },
    [navigation, backScreen, defaultValue, orderType, extendedHours, timeInForce, userPrice],
  );

  const onOrderTypeChange = useCallback((value) => {
    setOrderType(value as OrderType);
    if (value !== OrderType.MarketOrder) {
      showModal({
        activeModal: Modals.SetOrderPrice,
        defaultValues: {
          orderOptions: {
            ...defaultValue as OrderOptionsData,
            userPrice,
            orderType: value as OrderType,
            timeInForce,
            extendedHours,
          },
        },
      });
    }
  }, [showModal, defaultValue, userPrice, timeInForce, extendedHours]);

  const onTimeInForceChange = useCallback((v) => setTimeInForce(v as TimeInForce), []);

  return (
    <s.Container>
      <SwitchSelector
        data={selectorOptions}
        initialActiveId={orderType}
        onChanged={onOrderTypeChange}
      />
      <s.Row marginTop={45}>
        <s.ExtendedHoursCaption>Extended Market Hours</s.ExtendedHoursCaption>
        <s.ExtendedHoursSwitch
          value={extendedHours}
          onValueChange={setExtendedHours}
        />
        <s.InfoIcon />
      </s.Row>

      <s.Row marginTop={19}>
        <s.TimeInForceCaption>Time in Force</s.TimeInForceCaption>
        <s.TimeInForceSwitch
          data={[
            { title: TimeInForce.Day, id: TimeInForce.Day },
            { title: TimeInForce.GTC, id: TimeInForce.GTC },
          ]}
          initialActiveId={timeInForce}
          onChanged={onTimeInForceChange}
        />
        <s.InfoIcon />
      </s.Row>
    </s.Container>
  );
};

const selectorOptions = [
  {
    title: 'Market order',
    text: 'Officiis vitae maiores quia nobis autem nisi.',
    id: OrderType.MarketOrder,
  }, {
    title: 'Limit order',
    text: 'Officiis vitae maiores quia nobis autem nisi.',
    id: OrderType.LimitOrder,
  }, {
    title: 'Stop order',
    text: 'Officiis vitae maiores quia nobis autem nisi.',
    id: OrderType.StopOrder,
  },
];
