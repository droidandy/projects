import React, { FC, useCallback, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import SkeletonContent from 'react-native-skeleton-content';

import * as s from './homeStyles';
import { skeletonLayout } from './skeleton';

import { Endpoint } from '~/amplify/types';
import { Routes } from '~/app/home/navigation/routes';
import { HomeNavProps } from '~/app/home/navigation/types';
import { ProfileItem } from '~/app/profile/components/ProfileItem';
import { EmptyCard, ProfileCard, SelfCard } from '~/components/atoms/cards';
import { EmptyCardTypes, ProfileCardTypes } from '~/components/atoms/cards/types';
import { Chart } from '~/components/molecules/chart';
import { useInstrumentsFeedQuery } from '~/graphQL/hasura/generated-types';
import { QueryKeys, useQueryAndRefetchWhenFocused } from '~/graphQL/hooks/useQueryAndRefetchWhenFocused';
import Theme from '~/theme';
import { getRightFractionatedValue } from '~/utils/formatter';

export type Props = {
  navigation: HomeNavProps;
  route: any;
};

export const Home: FC<Props> = ({ navigation, route }) => {
  const navigate = useCallback((route, params = {}) => navigation.navigate(route, params), [navigation]);

  const { data } = useQueryAndRefetchWhenFocused(QueryKeys.GetCurrentUserDocument);
  const { data: dataA } = useInstrumentsFeedQuery({ context: { clientName: Endpoint.hasura } });
  const renderCard = React.useCallback(
    (type = ProfileCardTypes.Investack, routeName = Routes.MyStack) => ({ item }: any) => {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      const formattedDate = new Date(item.byDate).toLocaleDateString('en-US', options);
      return (
        <ProfileCard
          type={type}
          key={item.id}
          name={item.name}
          currentPrice={type === ProfileCardTypes.Investack ? item.currentPrice : item.targetPrice}
          closePrice={item.targetPrice}
          count={item.count}
          symbol={item?.instrument?.symbol}
          date={formattedDate}
          priceChangePercentage={item.priceChangePercentage}
          onPress={() => navigate(routeName, { data: item })}
        />
      );
    },
    [data],
  );

  const hunches = useMemo(() => {
    if (data?.currentUser?.__typename === 'User') {
      return data.currentUser.hunches.map((hunch) => ({
        author: data.currentUser,
        ...hunch,
      }));
    }
  }, [data]);

  const investacks = useMemo(() => {
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
          currentPrice: getRightFractionatedValue(currentPrice),
          closePrice: getRightFractionatedValue(currentPrice + currentPrice * stack.percentageChange),
          count: stack.instruments.length,
        };
      });
    }
    return [];
  }, [data]);

  const ContainerCard = (): JSX.Element => {
    if (data?.currentUser?.__typename === 'User') {
      const {
        userName, fullName, nStacks, nHunches, nFollowers, avatar,
      } = data.currentUser;

      return (
        <s.ContainerCard>
          <SelfCard
            fullName={fullName}
            userName={userName}
            onPress={() => {
              navigation.navigate(Routes.Main, { screen: Routes.Profile });
            }}
            following={nFollowers}
            hunches={nHunches}
            stacks={nStacks}
            source={{ uri: `data:image/png;base64,${avatar}` }}
            roundedTop
          />
        </s.ContainerCard>
      );
    }

    return (
      <SkeletonContent
        isLoading
        containerStyle={styles.skeletonContens}
        layout={skeletonLayout}
      />
    );
  };

  console.log('HOME:::: ', data, dataA);

  return (
    <Theme>
      <s.GradientLayer>
        <s.SafeArea>
          <s.Container>
            <ProfileItem
              face="secondary"
              onPress={() => navigation.navigate(Routes.Trade, { screen: Routes.AccountHighlights })}
              text="Account Highlights"
              subText="Retirement"
              withDivider={false}
            />
            <s.ChartWrapper>
              <Chart companyId={2662} />
            </s.ChartWrapper>
            <ProfileItem
              face="secondary"
              onPress={() => navigate(Routes.Stacks)}
              text="Investacks™"
              withDivider={false}
            />
            <s.Scroll
              keyExtractor={(item) => item.id}
              data={investacks}
              renderItem={renderCard(ProfileCardTypes.Investack)}
              ListFooterComponent={(
                <EmptyCard
                  key="emptyInvestack"
                  type={EmptyCardTypes.Investack}
                  first={!investacks || investacks?.length === 0}
                  onPress={() => navigate(Routes.CreateStackFlow)}
                />
              )}
              ItemSeparatorComponent={() => <s.Divider />}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
            <ProfileItem
              face="secondary"
              onPress={() => navigate(Routes.Hunches)}
              text="Hunches™"
              withDivider={false}
            />
            <s.Scroll
              keyExtractor={(item) => item.id}
              data={hunches}
              renderItem={renderCard(ProfileCardTypes.Hunch, Routes.Hunch)}
              ListFooterComponent={(
                <EmptyCard
                  key="emptyHunch"
                  type={EmptyCardTypes.Hunch}
                  first={!hunches || hunches?.length === 0}
                  onPress={() => navigate(Routes.CreateHunchFlow)}
                />
              )}
              ItemSeparatorComponent={() => <s.Divider />}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </s.Container>
        </s.SafeArea>
      </s.GradientLayer>
    </Theme>
  );
};

const styles = StyleSheet.create({
  skeletonContens: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 60,
    marginBottom: 40,
    marginHorizontal: 16,
  },
});
