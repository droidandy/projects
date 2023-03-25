import React from 'react';

import { hunches } from './data';
import * as s from './exploreStyles';

import { HomeNavProps } from '~/app/home/navigation/types';
import { ProfileCard } from '~/components/atoms/cards';
import { ProfileCardTypes } from '~/components/atoms/cards/types';
import { Hunch } from '~/graphQL/core/generated-types';
import Theme from '~/theme';

type Props = {
  navigation: HomeNavProps;
};

export const ExploreHunches = ({ navigation }: Props): JSX.Element => {
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
      <s.SafeArea>
        <s.FlatList
          numColumns={2}
          keyExtractor={(item: Hunch) => item.id}
          data={hunches}
          renderItem={renderCard}
        />
      </s.SafeArea>
    </Theme>
  );
};
