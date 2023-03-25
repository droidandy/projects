import { RouteProp } from '@react-navigation/native';
import React, {
  useEffect, useState, useCallback, useMemo,
} from 'react';
import { TouchableOpacity } from 'react-native';

import * as s from './buyOrSellScreenStyles';

import { Routes } from '~/app/home/navigation/routes';
import { TradeNavProps, TradeParamList } from '~/app/home/navigation/types';
import {
  OrderOptionsData,
  OrderType,
  TimeInForce,
  TradeType,
} from '~/app/home/types/trade';
import { Button } from '~/components/atoms/button';
import { Icon } from '~/components/atoms/icon';
import { useModal } from '~/components/modalScreen/useModal';
import { ModalParams, Modals } from '~/constants/modalScreens';
import Theme from '~/theme';

type Props = {
  navigation: TradeNavProps,
  route: RouteProp<TradeParamList, Routes.BuyOrSell>
};

export const BuyOrSellScreen = ({ navigation, route }: Props): JSX.Element => {
  const [sharesCount, setSharesCount] = useState(0);
  const [enterSharesMode, setEnterSharesMode] = useState(true);

  const [{ selectedValue }, showModal] = useModal();
  const [value, setValue] = useState<ModalParams>({});

  useEffect(() => {
    const companyName = route.params?.data?.companyName;
    const tradeType = route.params?.data?.tradeType;
    const oldValues = value.orderOptions;
    const needUpdate = (
      (companyName && oldValues?.companyName !== companyName)
      || (tradeType && oldValues?.tradeType !== tradeType)
    );
    if (needUpdate) {
      setValue((prev) => ({
        ...prev,
        orderOptions: {
          ...prev.orderOptions as OrderOptionsData, companyName, tradeType,
        },
      }));
    }
  }, [route, value]);

  useEffect(() => {
    if (selectedValue) {
      setValue(selectedValue);
      const newCompanyName = selectedValue.orderOptions?.companyName;
      const newTradeType = selectedValue.orderOptions?.tradeType;
      const needUpdate = Boolean(newCompanyName || newTradeType);
      if (needUpdate) {
        navigation.setParams({
          data: {
            companyName: newCompanyName || '',
            tradeType: newTradeType || TradeType.buy,
          },
        });
      }
    }
  }, [selectedValue, navigation]);

  const amount = useMemo(() => sharesCount * fakeData.sharePrice, [sharesCount]);

  const orderOptions = value.orderOptions || {} as OrderOptionsData;
  const {
    companyName,
    tradeType,
    orderType = OrderType.MarketOrder,
    extendedHours = false,
    timeInForce = TimeInForce.Day,
    userPrice,
  } = orderOptions;

  const toConfirm = useCallback(() => navigation.navigate(Routes.ConfirmTrade, {
    data: {
      tradeType,
      companyName,
      amount: Number(amount),
      shareCount: fakeData.shareCount,
      sharePrice: fakeData.sharePrice,
      orderType,
      timeInForce,
      extendedHours,
      accountId: fakeData.accountId,
    },
  }), [
    navigation, companyName, amount, value,
  ]);

  const calculatedValue = useMemo(
    () => (enterSharesMode
      ? `$${amount}`
      : `${fakeData.ticker} ${sharesCount}`),
    [enterSharesMode, amount, sharesCount],
  );

  const setInputValue = useCallback((t: string) => {
    setSharesCount(enterSharesMode ? Number(t) : Number(t) / fakeData.sharePrice);
  }, [enterSharesMode]);

  const selectOrderOptions = () => {
    showModal({ activeModal: Modals.OrderOptions, defaultValues: value });
  };

  return (
    <Theme>
      <s.SafeArea edges={['bottom']}>
        <s.Content behavior="padding">
          <s.Row>
            <s.CompanyName>{companyName}</s.CompanyName>
            <s.Logo source={require('~/assets/images/icon.png')} />
          </s.Row>
          <s.Row marginTop={8}>
            <s.CurrentPrice>{`$${fakeData.sharePrice}`}</s.CurrentPrice>
            <s.HalfWidthTouchable onPress={() => selectOrderOptions()}>
              <s.OrderType>{orderType}</s.OrderType>
              <Icon name="gear" />
            </s.HalfWidthTouchable>
          </s.Row>
          <s.Subcontainer>
            <s.ChartWrapper>
              <s.Chart
                companyId="mockedCompanyId"
                hidePeriodsPanel
                hideOverlay
                hidePrice
              />
            </s.ChartWrapper>
            <s.BelowChartContent>
              {orderType !== OrderType.MarketOrder && (
              <s.Row marginTop={17}>
                <s.HalfWidth>
                  <s.PriceCaption>
                    {`${orderType === OrderType.LimitOrder ? 'Limit' : 'Stop'} Price`}
                  </s.PriceCaption>
                  <Icon name="info" />
                </s.HalfWidth>
                <s.UserPrice>
                  $
                  {userPrice}
                </s.UserPrice>
              </s.Row>
              )}
              <s.RowAlignRight marginTop={3}>
                <s.Ticker>{enterSharesMode ? fakeData.ticker : '$'}</s.Ticker>
                <s.Amount
                  value={String(enterSharesMode ? sharesCount || '' : amount || '')}
                  onChangeText={setInputValue}
                  placeholder="0"
                  keyboardType="numeric"
                />
              </s.RowAlignRight>
              <s.Row marginTop={5}>
                <s.HalfWidth>
                  <s.BalanceCaption>Balance:</s.BalanceCaption>
                  <s.Balance>$12.500</s.Balance>
                </s.HalfWidth>
                <s.HalfWidth>
                  <s.Total>{calculatedValue}</s.Total>
                  <TouchableOpacity onPress={() => setEnterSharesMode((prev) => !prev)}>
                    <Icon name="exchange" size={26} />
                  </TouchableOpacity>
                </s.HalfWidth>
              </s.Row>
            </s.BelowChartContent>
          </s.Subcontainer>
          <s.Btn>
            <Button
              disabled={!sharesCount}
              title={tradeType === TradeType.buy ? 'Buy' : 'Sell'}
              face="blue"
              onPress={toConfirm}
            />
          </s.Btn>
        </s.Content>
      </s.SafeArea>
    </Theme>
  );
};

const fakeData = {
  companyName: 'Apple',
  ticker: 'AAPL',
  shareCount: 1,
  sharePrice: 231,
  accountId: 0,
};
