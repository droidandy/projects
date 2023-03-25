import React, { useCallback, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import * as s from '../module.styles';

import { Routes } from '~/app/home/navigation/routes';
import { HomeNavProps } from '~/app/home/navigation/types';
import { Button } from '~/components/atoms/button';
import { ButtonWithIcon } from '~/components/atoms/buttonWithIcon';
import { ProfileCard } from '~/components/atoms/cards';
import { ProfileCardTypes } from '~/components/atoms/cards/types';
import { TabBar } from '~/components/atoms/tabBar';
import { useGetCurrentUserHunchesQuery, Hunch } from '~/graphQL/core/generated-types';
import Theme from '~/theme';

enum Tab {
  my,
  following,
}

type Props = {
  navigation: HomeNavProps;
};

const tabs = [
  { id: Tab.my, label: 'My Hunches™' },
  { id: Tab.following, label: 'Following' },
];

export const Hunches = ({ navigation }: Props): JSX.Element => {
  const [activeTab, setActiveTab] = React.useState<Tab>(Tab.my);
  const navigate = useCallback((route) => navigation.navigate(route), [navigation]);

  const { data } = useGetCurrentUserHunchesQuery();

  const myHunches = useMemo(() => {
    if (data?.currentUser.__typename === 'User') {
      return data?.currentUser.hunches;
    }

    return [];
  }, [data]);

  const followedHunches = useMemo(() => {
    if (data?.currentUser.__typename === 'User') {
      return data?.currentUser.followedHunches;
    }

    return [];
  }, [data]);

  const hunches = {
    [Tab.my]: myHunches,
    [Tab.following]: followedHunches,
  };

  const renderCard = React.useCallback(({ item }: any) => (
    <s.Card>
      <ProfileCard
        type={ProfileCardTypes.Hunch}
        key={item.id}
        currentPrice={item.targetPrice}
        closePrice={item.targetPrice}
        symbol={item?.instrument?.symbol}
        date={item.date}
      />
    </s.Card>
  ),
  []);

  return (
    <Theme>
      <s.GradientLayerInner>
        <s.Content>
          <s.HeaderContent>
            <s.HeaderIconsContent>
              <ButtonWithIcon icon="backArrow" onPress={() => navigate(Routes.Home)} />
            </s.HeaderIconsContent>

            <s.Label>Hunches™</s.Label>

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
            numColumns={2}
            keyExtractor={(item: Hunch) => item.id}
            data={hunches[activeTab]}
            renderItem={renderCard}
          />
          <s.Btn>
            <s.BtnWrapper>
              <SafeAreaView edges={['bottom']}>
                <Button
                  disabled={false}
                  title="Create Hunch™"
                  face="primary"
                  onPress={() => navigate(Routes.CreateHunchFlow)}
                />
              </SafeAreaView>
            </s.BtnWrapper>
          </s.Btn>
        </s.Content>
      </s.GradientLayerInner>
    </Theme>
  );
};
