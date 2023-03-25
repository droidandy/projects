import { RouteProp } from '@react-navigation/native';
import React from 'react';
import { Switch } from 'react-native';

import * as s from './confirmScreenStyles';

import { Routes } from '~/app/home/navigation/routes';
import { TradeNavProps, TradeParamList } from '~/app/home/navigation/types';
import { TradeType } from '~/app/home/types/trade';
import { Button } from '~/components/atoms/button/Button';
import { showNotification } from '~/components/atoms/notifier';

type Props = {
  navigation: TradeNavProps,
  route: RouteProp<TradeParamList, Routes.ConfirmTrade>,
};

export const ConfirmScreen = ({ navigation, route }: Props): JSX.Element => {
  const { data } = route.params;
  const {
    tradeType, companyName, amount, shareCount, sharePrice, orderType, timeInForce, extendedHours,
  } = data;

  const isBuying = tradeType === TradeType.buy;

  return (
    <s.SafeArea>
      <s.Container>
        <s.TitleContainer>
          <s.Title>You are </s.Title>
          <s.TitleBold>{isBuying ? 'buying' : 'selling'}</s.TitleBold>
        </s.TitleContainer>
        <s.Amount>
          $
          {amount}
        </s.Amount>
        <s.AmountExplainationContainer>
          <s.WorthOf>worth of</s.WorthOf>
          <s.CompanyLogo source={require('~/assets/images/icon.png')} />
          <s.CompanyName>{companyName}</s.CompanyName>
        </s.AmountExplainationContainer>
        <s.SharePrice>
          {shareCount}
          {' '}
          share @ $
          {sharePrice}
          {' '}
          / share
          {' '}
        </s.SharePrice>
      </s.Container>
      <s.DetailsContainer>
        <s.DetailsRow>
          <s.DetailsText>Order type</s.DetailsText>
          <s.DetailsText>{orderType}</s.DetailsText>
        </s.DetailsRow>
        <s.DetailsRow>
          <s.DetailsText>Time in force</s.DetailsText>
          <s.DetailsText>{timeInForce}</s.DetailsText>
        </s.DetailsRow>
        <s.DetailsRow>
          <s.DetailsText>Account</s.DetailsText>
          <s.DetailsText>{`${fakeAccountData.type} $(${fakeAccountData.balance})`}</s.DetailsText>
        </s.DetailsRow>
        <s.DetailsRow>
          <s.DetailsText>Extended market hours</s.DetailsText>
          <Switch value={extendedHours} disabled />
        </s.DetailsRow>
      </s.DetailsContainer>
      <s.Btn>
        <Button
          title={`Confirm ${isBuying ? 'buy' : 'sell'}`}
          face="blue"
          onPress={() => showNotification({
            title: `$${amount} AAPL Limit ${isBuying ? 'buy' : 'sell'}`,
            description: 'Your order is succesfully submitted',
          })}
        />
      </s.Btn>

    </s.SafeArea>
  );
};

const fakeAccountData = {
  type: 'Retirement',
  balance: '12,500',
};
