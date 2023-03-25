import React, { FC, useCallback } from 'react';
import { FlatList } from 'react-native';

import { Search } from './Search';
import {
  users,
  companies,
  investacks,
  hunches,
} from './data';
import * as s from './exploreStyles';

import { Routes } from '~/app/home/navigation/routes';
import { ExploreNavProps } from '~/app/home/navigation/types';
import { ProfileItem } from '~/app/profile/components/ProfileItem';
import { Avatar } from '~/components/atoms/avatar';
import { ProfileCard, CompanyCard } from '~/components/atoms/cards';
import { ProfileCardTypes } from '~/components/atoms/cards/types';
import Theme from '~/theme';

type Props = {
  navigation: ExploreNavProps;
};

const options = { year: 'numeric', month: 'short', day: 'numeric' };

export const Explore: FC<Props> = ({ navigation }) => {
  const navigate = useCallback((route, params = {}) => navigation.navigate(route, params), [navigation]);
  const [searchValue, setSearchValue] = React.useState<string>('');
  const renderCard = React.useCallback(
    (type = ProfileCardTypes.Investack, routeName = Routes.OtherStack) => ({ item }: any) => {
      const formattedDate = new Date(item.byDate).toLocaleDateString('en-US', options);
      return (
        <ProfileCard
          type={type}
          key={item.id}
          name={item.name}
          currentPrice={type === ProfileCardTypes.Investack ? item.currentPrice : item.targetPrice}
          closePrice={item.targetPrice}
          count={item.count}
          symbol={item?.symbol}
          date={formattedDate}
          priceChangePercentage={item.priceChangePercentage}
          onPress={() => navigate(routeName, { data: item })}
        />
      );
    },
    [],
  );

  const renderInvestopeerCard = React.useCallback(({ item }: any) => <Avatar key={item.id} {...item} />,
    []);

  const renderCompanyCard = React.useCallback(({ item }: any) => (
    <CompanyCard
      key={item.id}
      onPress={() => navigate(Routes.CompanyProfile, { companyId: item.id })}
      {...item}
    />
  ), []);

  const headerComponent = React.useCallback(() => (
    <Search placeholder="Search" value={searchValue} onChangeText={setSearchValue} />
  ), []);

  const listData = React.useMemo(() => (
    [
      {
        text: 'Hunches to follow',
        onPress: () => navigate(Routes.ExploreHunches),
        data: hunches,
        render: renderCard(ProfileCardTypes.Hunch, Routes.Hunch),
      },
      {
        text: 'Investacks to follow',
        onPress: () => navigate(Routes.ExploreStacks),
        data: investacks,
        render: renderCard(ProfileCardTypes.Investack),
      },
      {
        text: 'Companies to follow',
        onPress: () => navigate(Routes.CompaniesList),
        data: companies,
        render: renderCompanyCard,
      },
      {
        text: 'Investopeers to follow',
        onPress: () => {},
        data: users,
        render: renderInvestopeerCard,
      },
    ]
  ), [navigate]);

  return (
    <Theme>
      <s.SafeArea>
        <s.List
          keyExtractor={(item) => item.text || item.id}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
          sections={listData}
          ListHeaderComponent={headerComponent}
          renderSectionHeader={({ section }) => (
            <>
              <ProfileItem face="tertiary" withDivider={false} {...section} />
              <FlatList
                keyExtractor={(item) => item.id}
                data={section.data}
                renderItem={section.render}
                ItemSeparatorComponent={() => <s.Divider />}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </>
          )}
          initialNumToRender={14}
          renderItem={() => null}
        />
      </s.SafeArea>
    </Theme>
  );
};
