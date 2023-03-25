import React, { useMemo, useState } from 'react';
import { SectionList } from 'react-native';

import {
  Wrapper,
  Header,
  HeaderText,
  Filters,
  SectionHeader
} from './documentsScreenStyles';

import { ProfileNavProps } from '~/app/home/navigation/types';
import { Document } from '~/app/profile/screens/DocumentsScreen/document/Document';
import { lastWeek, today } from '~/app/profile/screens/DocumentsScreen/mocks';
import { ButtonWithIcon } from '~/components/atoms/buttonWithIcon';
import { FilterDirectionPair, FilterOrderItem } from '~/components/molecules/filters';
import Theme from '~/theme';

export enum Filter {
  type,
  company,
}

export const filters: FilterOrderItem[] = [
  { id: Filter.type, label: 'Type' },
  { id: Filter.company, label: 'Company' },
];

type Props = {
  navigation: ProfileNavProps;
};

export const DocumentsScreen = ({ navigation }: Props): JSX.Element => {
  const [filter, setFilter] = useState<FilterDirectionPair>();
  const sections = useMemo(() => [
    { name: 'Today', data: today },
    { name: 'Last week', data: lastWeek },
  ], [today, lastWeek]);

  return (
    <Theme>
      <Wrapper>
        <Header>
          <HeaderText>Documents</HeaderText>
          <ButtonWithIcon
            icon="search"
            onPress={() => navigation.goBack()}
          />
        </Header>
        <Filters filtersOrder={filters} justify="flex-end" onChange={setFilter} />
        <SectionList
          showsVerticalScrollIndicator={false}
          sections={sections}
          keyExtractor={(item, index) => `${item.id}${index}`}
          renderItem={({ item }) => (
            <Document document={item} />
          )}
          renderSectionHeader={({ section }) => (
            <SectionHeader>{section.name}</SectionHeader>
          )}
        />
      </Wrapper>
    </Theme>
  );
};
