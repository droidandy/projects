import React, { useCallback, useMemo } from 'react';

import * as s from '../module.styles';

import { Routes } from '~/app/home/navigation/routes';
import { HomeNavProps } from '~/app/home/navigation/types';
import { Button } from '~/components/atoms/button';
import { ButtonWithIcon } from '~/components/atoms/buttonWithIcon';
import { ProfileCard } from '~/components/atoms/cards';
import { ProfileCardTypes } from '~/components/atoms/cards/types';
import { TabBar } from '~/components/atoms/tabBar';
import { useGetCurrentUserStacksQuery, Stack } from '~/graphQL/core/generated-types';
import Theme from '~/theme';
import {SafeAreaView} from "react-native-safe-area-context";

enum Tab {
  my,
  following,
}

type Props = {
  navigation: HomeNavProps;
};

const tabs = [{ label: 'My Investacks™', id: Tab.my }, { label: 'Following', id: Tab.following }];
const routes = {
  [Tab.my]: Routes.MyStack,
  [Tab.following]: Routes.OtherStack,
};

export const Stacks = ({ navigation }: Props): JSX.Element => {
  const [activeTab, setActiveTab] = React.useState<Tab>(Tab.my);
  const navigate = useCallback((route, params = {}) => navigation.navigate(route, params), [navigation]);

  const { data } = useGetCurrentUserStacksQuery();

  const myStacks = useMemo(() => {
    if (data?.currentUser.__typename === 'User') {
      return data?.currentUser.stacks.map((stack) => {
        const currentPrice = stack.instruments
          .reduce(
            (total, instrument) => total + (instrument.currentPrice ?? 0),
            0,
          );

        return {
          ...stack,
          id: stack.id,
          name: stack.name,
          currentPrice,
          closePrice: currentPrice + currentPrice * stack.percentageChange,
          count: stack.instruments.length,
        };
      });
    }

    return [];
  }, [data]);

  const followedStack = useMemo(() => {
    if (data?.currentUser.__typename === 'User') {
      return data?.currentUser.followedStacks.map((stack) => {
        const currentPrice = stack.instruments
          .reduce(
            (total, instrument) => total + (instrument.currentPrice ?? 0),
            0,
          );

        return {
          ...stack,
          id: stack.id,
          name: stack.name,
          currentPrice,
          closePrice: currentPrice + currentPrice * stack.percentageChange,
          count: stack.instruments.length,
        };
      });
    }

    return [];
  }, [data]);

  const stacks = {
    [Tab.my]: myStacks,
    [Tab.following]: followedStack,
  };

  const renderCard = React.useCallback(
    (routeName = Routes.MyStack) => ({ item }: any) => (
      <s.Card>
        <ProfileCard
          type={ProfileCardTypes.Investack}
          key={item.id}
          name={item.name}
          currentPrice={item.currentPrice}
          closePrice={item.closePrice}
          count={item.count}
          symbol={item.symbol}
          date={item.date}
          onPress={() => navigate(routeName, { data: item })}
        />
      </s.Card>
    ),
    [],
  );

  return (
    <Theme>
      <s.GradientLayerInner>
        <s.Content>
          <s.HeaderContent>
            <s.HeaderIconsContent>
              <ButtonWithIcon icon="backArrow" onPress={() => navigate(Routes.Home)} />
            </s.HeaderIconsContent>

            <s.Label>Investacks™</s.Label>

            <s.HeaderIconsContent>
              <ButtonWithIcon icon="trash" onPress={() => navigate(Routes.Home)} />
            </s.HeaderIconsContent>
          </s.HeaderContent>
          <s.TextInputContainer>
            <s.Row>
              <TabBar activeTab={activeTab} tabs={tabs} onTabChange={setActiveTab} />
            </s.Row>
          </s.TextInputContainer>
          <s.Scroll1
            numColumns={3}
            keyExtractor={(item: Stack) => item.id}
            data={stacks[activeTab]}
            renderItem={renderCard(routes[activeTab])}
          />
          <s.Btn>
            <s.BtnWrapper>
              <SafeAreaView edges={['bottom']}>
                <Button
                  disabled={false}
                  title="Create Investack™"
                  face="primary"
                  onPress={() => navigate(Routes.CreateStackFlow)}
                />
              </SafeAreaView>
            </s.BtnWrapper>
          </s.Btn>
        </s.Content>
      </s.GradientLayerInner>
    </Theme>
  );
};
