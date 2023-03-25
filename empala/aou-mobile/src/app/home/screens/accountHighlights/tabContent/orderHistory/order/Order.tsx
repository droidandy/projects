import React from 'react';
import { View } from 'react-native';

import { StatusWrapper } from './styles';

import * as s from '~/app/home/screens/accountHighlights/tabContent/section/styles';
import { Order as OrderType } from '~/app/home/types/trade';

type Props = {
  order: OrderType;
  onPress?: () => void;
};

export const Order = ({ order, onPress }: Props): JSX.Element => {
  const formattedOrderStatusDate = new Date(order.statusDate).toLocaleDateString('ko-KR');

  return (
    <s.ListItem onPress={onPress}>
      {order.company.image}
      <View>
        <s.ListItemMainText>{order.company.name}</s.ListItemMainText>
        <s.ListItemSecondText>{order.company.sym}</s.ListItemSecondText>
      </View>
      <s.ListItemMainText>{order.type}</s.ListItemMainText>
      <View>
        <s.ListItemMainText>
          {order.value < 0 ? '-' : ''}
          $
          {Math.abs(order.value)}
        </s.ListItemMainText>
        <s.ListItemSecondText>
          {order.shares}
          {' share'}
        </s.ListItemSecondText>
      </View>
      <StatusWrapper>
        <s.ListItemMainText>
          {order.status}
        </s.ListItemMainText>
        <s.ListItemSecondText>
          {formattedOrderStatusDate}
        </s.ListItemSecondText>
      </StatusWrapper>
      <s.ListItemUnderline />
    </s.ListItem>
  );
};
