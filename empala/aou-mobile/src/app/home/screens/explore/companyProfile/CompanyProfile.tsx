import { RouteProp } from '@react-navigation/native';
import React, { useCallback, useMemo } from 'react';

import * as s from './companyProfileStyles';
import { Order as OrderType, orders } from './mocks';

import { Routes } from '~/app/home/navigation/routes';
import { ExploreParamList, TradeNavProps } from '~/app/home/navigation/types';
import { ActiveOrders } from '~/app/home/screens/explore/companyProfile/activeOrders/ActiveOrders';
import { TradeType } from '~/app/home/types/trade';
import { Chart } from '~/components/molecules/chart';
import { TradeButton } from '~/components/molecules/fullWidthFAB/FullWidthFAB';
import { useOneRandomInstQuery } from '~/graphQL/core/generated-types';
import Theme from '~/theme';

const ACTIVE_ORDERS_MOCK: OrderType[] = orders;

type Props = {
  navigation: TradeNavProps;
  route: RouteProp<ExploreParamList, Routes.CompanyProfile>;
};

export const CompanyProfile = ({ navigation, route }: Props): JSX.Element => {
  const companyId = (route?.params?.companyId || 1).toString();
  const { loading, error, data } = useOneRandomInstQuery({
    variables: { oneRandomInstInstIds: [companyId] },
  });

  const companyData = useMemo(() => {
    const d = data?.oneRandomInst;
    return (d?.__typename === 'Instrument') ? {
      name: d.name,
      stacks: d.stacks.length,
      hunches: d.hunches.length,
    } : {
      name: 'n/a',
      stacks: 0,
      hunches: 0,
    };
  }, [data]);

  const tradeButtons = useMemo(() => {
    const onPress = (tradeType: TradeType) => () => navigation.navigate(Routes.Trade, {
      screen: Routes.BuyOrSell,
      params: {
        data: {
          tradeType,
          companyName: companyData.name,
        },
      },
    });

    return [
      {
        key: 1,
        text: 'Buy',
        onPress: onPress(TradeType.buy),
      }, {
        key: 2,
        text: 'Sell',
        onPress: onPress(TradeType.sell),
      },
    ];
  }, [navigation, companyData]);

  const listData = useMemo(() => {
    if (data?.oneRandomInst?.__typename === 'Instrument') {
      return [
        {
          title: 'Your position',
          data: [
            { text: 'Shares', value: `${fakeData.shares.amount} shares @ $${fakeData.shares.price}` },
            { text: 'Value', value: `$${fakeData.value}` },
            { text: 'Total P&L', value: `$${fakeData.totalPL.abs} (${fakeData.totalPL.rel}%)` },
            { text: 'Today\'s P&L', value: `$${fakeData.todaysPL.abs} (${fakeData.todaysPL.rel}%)` },
            { text: 'Cost basis - Per share', value: `$${fakeData.costBasisPerShare}` },
            { text: 'Cost basis - Total', value: `$${fakeData.costBasisTotal}` },
          ],
        },
        {
          title: 'Statistics',
          data: [
            { text: 'Market Cap', value: `$ ${fakeData.marketCap}` },
            { text: 'PE Ratio', value: `${fakeData.PERatio}` },
            { text: 'Dividend Yield', value: `${fakeData.dividendYield}%` },
          ],
        },
      ];
    }
    return null;
  }, [data]);

  const renderHeader = useCallback(() => (
    <>
      <s.Row>
        <ActiveOrders orders={ACTIVE_ORDERS_MOCK} />
      </s.Row>

      <s.Row>
        <s.CompanyName>{companyData.name}</s.CompanyName>
        <s.Logo source={require('~/assets/images/icon.png')} />
      </s.Row>

      <s.Row marginTop={21}>
        <s.HalfWidth>
          <s.AvatarsContainer size={s.AvatarSize.Big}>
            {fakeUsers.map((user) => (
              <s.Avatar
                key={user.id}
                size={s.AvatarSize.Big}
                source={{ uri: `data:image/png;base64,${user.avatar}` }}
                resizeMode="cover"
              />
            ))}
          </s.AvatarsContainer>
          <s.InStacks>
            {`in ${companyData.stacks} Investacks`}
          </s.InStacks>
        </s.HalfWidth>
        <s.HalfWidth>
          <s.AvatarsContainer size={s.AvatarSize.Small}>
            {fakeUsers.map((user) => (
              <s.Avatar
                key={user.id}
                size={s.AvatarSize.Small}
                source={{ uri: `data:image/png;base64,${user.avatar}` }}
                resizeMode="cover"
              />
            ))}
          </s.AvatarsContainer>
          <s.InStacks>
            {companyData.hunches}
            {' '}
            hunches
          </s.InStacks>
        </s.HalfWidth>
      </s.Row>
      <s.ChartWrapper>
        <Chart companyId={companyId} />
      </s.ChartWrapper>
    </>
  ), [companyData]);

  return (
    <Theme>
      <s.Wrapper>
        {listData && (
          <s.List
            ListHeaderComponent={renderHeader()}
            sections={listData}
            renderSectionHeader={
              ({ section }) => (<s.Group>{section.title}</s.Group>)
            }
            keyExtractor={(item) => item.text}
            renderItem={
              ({ item }) => (
                <s.Item>
                  <s.ItemTitle>{item.text}</s.ItemTitle>
                  <s.ItemData>{item.value}</s.ItemData>
                </s.Item>
              )
            }
          />
        )}
        <TradeButton
          mainButtonText="Trade"
          buttons={tradeButtons}
        />
      </s.Wrapper>
    </Theme>
  );
};

const fakeUsers = [
  { id: 1, avatar: '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' },
  { id: 2, avatar: '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' },
  { id: 3, avatar: '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' },
];

const fakeData = {
  orders: [],
  shares: {
    amount: 16,
    price: 154.71,
  },
  value: 2135,
  totalPL: {
    abs: 345,
    rel: 6.2,
  },
  todaysPL: {
    abs: 5,
    rel: 0.2,
  },
  costBasisPerShare: 146.3,
  costBasisTotal: 1832,
  marketCap: '2235B',
  PERatio: 30064,
  dividendYield: 0.66,
};
