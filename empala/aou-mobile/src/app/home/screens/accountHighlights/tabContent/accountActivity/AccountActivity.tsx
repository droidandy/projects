import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { SectionList } from 'react-native';

import { Activity } from './activity';
import { filters } from './constants';
import * as s from './styles';
import { Activity as ActivityType, Section as SectionType } from './types';

import { Routes } from '~/app/home/navigation/routes';
import { TradeNavProps } from '~/app/home/navigation/types';
import {
  todayActivities,
  yesterdayActivities,
} from '~/app/home/screens/accountHighlights/tabContent/accountActivity/mocks';
import { SectionHeader } from '~/components/atoms/sections';
import { FilterDirectionPair, Filters } from '~/components/molecules/filters';

const todayActivity: ActivityType[] = todayActivities;
const yesterdayActivity: ActivityType[] = yesterdayActivities;

export const AccountActivity = (): JSX.Element => {
  const [filter, setFilter] = useState<FilterDirectionPair>();
  const sections: SectionType[] = useMemo(() => [
    { name: 'Today', data: todayActivity },
    { name: 'Yesterday', data: yesterdayActivity },
  ], [todayActivity, yesterdayActivity]);

  const navigation = useNavigation<TradeNavProps>();

  return (
    <s.Wrapper>
      <s.FiltersWrapper>
        <Filters filtersOrder={filters} onChange={setFilter} />
      </s.FiltersWrapper>
      <s.SectionsWrapper>
        <SectionList
          showsVerticalScrollIndicator={false}
          sections={sections}
          keyExtractor={(item, index) => `${item.id}${index}`}
          renderItem={({ item }) => (
            <Activity
              activity={item}
              onPress={() => navigation.navigate(Routes.ActivityDetails, { activity: item })}
            />
          )}
          renderSectionHeader={({ section }) => (
            <SectionHeader>{section.name}</SectionHeader>
          )}
        />
      </s.SectionsWrapper>
    </s.Wrapper>
  );
};
