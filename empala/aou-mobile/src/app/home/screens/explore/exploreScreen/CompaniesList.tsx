import React, { FC } from 'react';

import { CompanyTicker } from './CompanyTicker';
import { Search } from './Search';
import * as s from './companiesListStyles';

import { Routes } from '~/app/home/navigation/routes';
import { ExploreNavProps } from '~/app/home/navigation/types';
import { useThrottlesCompanySearchQuery } from '~/graphQL/hooks/useThrottlesCompanySearchQuery';
import Theme from '~/theme';

type Props = {
  navigation: ExploreNavProps;
};

export const CompaniesList: FC<Props> = ({ navigation }) => {
  const navigate = React.useCallback((route, params = {}) => navigation.navigate(route, params), [navigation]);
  const [searchValue, setSearchValue] = React.useState<string>('');
  const { companies } = useThrottlesCompanySearchQuery(searchValue);

  const renderCard = React.useCallback(({ item }: any) => (
    <CompanyTicker
      key={item.symbol}
      item={item}
      onPress={() => navigate(Routes.CompanyProfile, { companyId: item.id })}
    />
  ), []);

  const headerComponent = React.useCallback(() => (
    <Search placeholder="Search companies" value={searchValue} onChangeText={setSearchValue} />
  ), []);

  return (
    <Theme>
      <s.List
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        data={companies}
        ListHeaderComponent={headerComponent}
        renderItem={renderCard}
      />
    </Theme>
  );
};
