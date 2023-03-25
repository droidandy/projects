import { differenceWith, unionWith } from 'lodash';
import React, {
  useMemo, useState, useCallback, useContext,
} from 'react';

import { DataFields, OnboardingContextData } from '../../types';

import * as s from './companySearcherStyles';

import { OnboardingNavProps } from '~/app/home/navigation/types';
import { equalById } from '~/app/signup/utils';
import { StepContainerContext } from '~/components/StepContainer/types';
import { Button } from '~/components/atoms/button';
import { CompanyTicker } from '~/components/atoms/companyTicker';
import { SearchBox } from '~/components/atoms/searchBox';
import { Instrument } from '~/graphQL/core/generated-types';
import { useThrottlesCompanySearchQuery } from '~/graphQL/hooks/useThrottlesCompanySearchQuery';

type Props = {
  navigation: OnboardingNavProps,
};

export const CompanySearcher = ({ navigation }: Props): JSX.Element => {
  const { scState, setSCState } = useContext(StepContainerContext);

  const [selectedItems, setSelectedItems] = useState<Instrument[]>([]);
  const [deselectedItems, setDeselectedItems] = useState<Instrument[]>([]);

  const selectedFromContext = useMemo(
    () => (scState as OnboardingContextData)[DataFields.selectedCompanies] || [],
    [scState],
  );

  const allSelected = useMemo(() => differenceWith(
    unionWith(selectedFromContext, selectedItems), deselectedItems, equalById,
  ),
  [selectedFromContext, selectedItems, deselectedItems]);

  React.useEffect(
    () => {
      const unsubscribe = navigation.addListener('beforeRemove', () => {
        setSCState(
          (prevState: OnboardingContextData) => ({
            ...prevState,
            [DataFields.selectedCompanies]: allSelected,
          }),
        );
      });
      return unsubscribe;
    },
    [navigation, setSCState, allSelected],
  );

  const [searchValue, setSearchValue] = useState<string>('');

  const { companies } = useThrottlesCompanySearchQuery(searchValue);

  // TODO - reimplement CompanyTicker so that it takes Instrument instead of InstrumentType
  // & in this line we'll only map id to symbol & text to description
  const instruments = useMemo(
    () => companies
      .map((item) => ({
        ...item,
        text: item.description,
        name: item.description,
      })),
    [companies],
  );

  const itemSelectedListener = useCallback((item: Instrument, selected: boolean) => {

    if (selected) {
      setSelectedItems((prev) => [...prev, item]);
      setDeselectedItems((prev) => prev.filter((i) => i.id !== item.id));
    } else {
      setDeselectedItems((prev) => [...prev, item]);
      setSelectedItems((prev) => prev.filter((i) => i.id !== item.id));
    }
  }, []);

  const renderItem = useCallback(({ item }: { item: Instrument }) => (
    <CompanyTicker
      key={item.symbol}
      item={item}
      onSelect={itemSelectedListener}
      selected={allSelected.some((i) => i.id === item.id)}
    />
  ), [itemSelectedListener, allSelected]);

  return (
    <s.Slide>
      <s.SearchBoxContainer>
        <SearchBox value={searchValue} onChangeText={setSearchValue} onClose={console.log} />
      </s.SearchBoxContainer>

      <s.List
        data={instruments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      <Button
        title="Ok"
        face="primary"
        onPress={() => navigation.goBack()}
      />
    </s.Slide>
  );
};
