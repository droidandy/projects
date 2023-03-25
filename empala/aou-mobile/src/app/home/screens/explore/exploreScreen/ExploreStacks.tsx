import React from 'react';

import { investacks } from './data';
import * as s from './exploreStyles';

import { Routes } from '~/app/home/navigation/routes';
import { HomeNavProps } from '~/app/home/navigation/types';
import { ProfileCard } from '~/components/atoms/cards';
import { ProfileCardTypes } from '~/components/atoms/cards/types';
import { Stack } from '~/graphQL/core/generated-types';
import Theme from '~/theme';

type Props = {
  navigation: HomeNavProps;
};

export const ExploreStacks = ({ navigation }: Props): JSX.Element => {
  const renderCard = React.useCallback(({ item }: any) => (
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
        onPress={() => navigation.navigate(Routes.OtherStack, { data: item })}
      />
    </s.Card>
  ),
  []);

  return (
    <Theme>
      <s.SafeArea>
        <s.FlatList
          numColumns={3}
          keyExtractor={(item: Stack) => item.id}
          data={investacks}
          renderItem={renderCard}
        />
      </s.SafeArea>
    </Theme>
  );
};
