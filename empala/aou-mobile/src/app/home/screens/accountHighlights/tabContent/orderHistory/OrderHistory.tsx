import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { SectionList } from 'react-native';

import { filters } from './constants';
import { ordersGenerator } from './mocks';
import { Order } from './order';
import * as s from './styles';
import { Section as SectionType } from './types';

import { Routes } from '~/app/home/navigation/routes';
import { Order as OrderType } from '~/app/home/types/trade';
import { SectionHeader } from '~/components/atoms/sections';
import { Filters, FilterDirectionPair } from '~/components/molecules/filters';

const openOrders: OrderType[] = ordersGenerator('day', 1, 0);
const todayOrders: OrderType[] = ordersGenerator('day', 3, 0);
const lastWeekOrders: OrderType[] = ordersGenerator('day', 8, 1000 * 60 * 60 * 24 * 7);

export const OrderHistory = (): JSX.Element => {
  const [filter, setFilter] = useState<FilterDirectionPair>();
  const navigation = useNavigation();
  const sections: SectionType[] = useMemo(() => [
    { name: 'Open Orders', data: openOrders },
    { name: 'Today', data: todayOrders },
    { name: 'Last week', data: lastWeekOrders },
  ], [openOrders, todayOrders, lastWeekOrders]);

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
            <Order
              order={item}
              onPress={() => navigation.navigate(Routes.OrderDetails, { order: item })}
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
