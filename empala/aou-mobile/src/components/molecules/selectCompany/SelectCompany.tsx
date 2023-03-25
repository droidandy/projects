import React, { useState, useCallback, useMemo } from 'react';
import { FlatList } from 'react-native';

import * as s from './selectCompanyStyles';

import { DataFields } from '~/app/home/types/investack';
import { OctagonIcon } from '~/assets/icons/Icons';
import { ActionTypes, CallbackType } from '~/components/StepContainer/types';
import { Button } from '~/components/atoms/button';
import { CompanyTicker } from '~/components/atoms/companyTicker';
import { OnboardingLoader } from '~/components/atoms/loader';
import { SearchBox } from '~/components/atoms/searchBox';
import { Company, CompanySearchQueryResult } from '~/graphQL/hooks/useThrottlesCompanySearchQuery';
import Theme from '~/theme';
import {SafeAreaView} from "react-native-safe-area-context";

type Props = {
  subtitle: string;
  fetchData: (searchValue: string) => CompanySearchQueryResult;
  dataFieldName: DataFields;
  [DataFields.selectedCompanies]: Array<Company>,
  callback?: CallbackType;
  select?: boolean;
};

export const SelectCompany = ({
  subtitle,
  fetchData,
  dataFieldName,
  [DataFields.selectedCompanies]: initialSelectedCompanies = [],
  callback,
  select,
}: Props): JSX.Element => {
  const [searchValue, setSearchValue] = useState<string>('');
  const { companies, loading } = fetchData(searchValue);

  const [selectedCompanies, setSelectedCompanies] = useState<Array<Company>>(initialSelectedCompanies);
  const selectedCompaniesSymbols = useMemo(
    () => selectedCompanies.map(({ symbol }) => symbol),
    [selectedCompanies],
  );

  const companiesList = useMemo(
    () => [
      ...selectedCompanies,
      ...(loading ? [] : companies.filter(({ symbol }) => !selectedCompaniesSymbols.includes(symbol))),
    ],
    [companies, selectedCompanies, selectedCompaniesSymbols, loading],
  );

  const toContinue = (item: Company | Array<Company>) => {
    callback?.({
      type: ActionTypes.NAVIGATE_NEXT_SCREEN,
      args: { [dataFieldName]: item },
    });
  };

  const selectCompany = useCallback((
    company: Company,
    selected: boolean,
  ) => {
    setSelectedCompanies((prevSelectedCompanies) => {
      const found = prevSelectedCompanies.some(({ symbol }) => symbol === company.symbol);

      if (selected && !found) {
        setSelectedCompanies([...prevSelectedCompanies, company]);
      } else if (!selected && found) {
        setSelectedCompanies([...prevSelectedCompanies.filter(({ symbol }) => symbol !== company.symbol)]);
      }

      return prevSelectedCompanies;
    });
  }, [selectedCompanies, selectedCompaniesSymbols]);

  const renderItem = ({ item }: { item: Company }) => (
    <CompanyTicker
      key={item.symbol}
      selected={selectedCompaniesSymbols.includes(item.symbol)}
      item={item}
      onPress={select ? undefined : toContinue}
      onSelect={select ? selectCompany : undefined}
    />
  );

  const EmptyComponent = () => {
    if (loading) {
      return null;
    }

    return (
      <s.EmptyContainer>
        <OctagonIcon />
        <s.EmptyText>
          Sorry, we couldn’t find any company or stock with the name
          {' '}
          {searchValue}
        </s.EmptyText>
      </s.EmptyContainer>
    );
  };

  return (
    <Theme>
      <s.Slide>
        <s.Content>
          <s.Text>{subtitle}</s.Text>

          <s.TextInputContainer>
            <SearchBox
              value={searchValue}
              onChangeText={setSearchValue}
              onClose={console.log}
            />
          </s.TextInputContainer>

          <s.FlatListContainer>
            <FlatList
              style={{ opacity: loading ? 0.2 : 1 }}
              data={companiesList}
              renderItem={renderItem}
              keyExtractor={item => item.symbol}
              ListEmptyComponent={EmptyComponent}
              extraData={selectedCompaniesSymbols}
            />
            {loading && (
              <s.LoadingIndicatorContainer>
                <OnboardingLoader />
              </s.LoadingIndicatorContainer>
            )}
          </s.FlatListContainer>

          {!!select && (
            <s.ButtonContainer>
              <Button
                title={'Continue'.toUpperCase()}
                face="primary"
                blur={10}
                disabled={!selectedCompanies.length}
                onPress={() => toContinue(selectedCompanies)}
              />
            </s.ButtonContainer>
          )}
        </s.Content>
      </s.Slide>
    </Theme>
  );
};
