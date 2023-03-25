import React, { useCallback } from 'react';
import { Text } from 'react-native';

import { Order as OrderType } from '../mocks';

import * as s from './styles';
import { CompanyName, RightPartText } from './styles';

type Props = {
  order: OrderType;
  onPress?: (order: OrderType) => void;
};

export const Order = ({ order, onPress }: Props): JSX.Element => {
  const handlePress = useCallback(() => {
    onPress?.(order);
  }, [onPress, order]);

  return (
    <s.Wrapper onPress={handlePress}>
      <s.LeftPart>
        <s.Company>
          {order.company.image}
          <s.CompanyName>{order.company.name}</s.CompanyName>
        </s.Company>
        <s.Value>
          {order.value < 0 ? '- ' : ''}
          $
          {Math.abs(order.value)}
        </s.Value>
      </s.LeftPart>
      <s.RightPart>
        <s.OrderType>{order.type}</s.OrderType>
        <s.RightPartText>
          {`${order.shares} share @ `}
          {order.sharesValue < 0 ? '- ' : ''}
          $
          {Math.abs(order.sharesValue)}
        </s.RightPartText>
      </s.RightPart>
    </s.Wrapper>
  );
};
