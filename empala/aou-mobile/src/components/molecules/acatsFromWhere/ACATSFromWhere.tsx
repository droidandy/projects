import React, { useEffect, useState } from 'react';
import { TouchableOpacity, ListRenderItem } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import { FlatList } from 'react-native-gesture-handler';

import * as Styled from './ACATSFromWhereStyles';

import { ActionTypes, CallbackType } from '~/components/StepContainer/types';
import { Endpoints } from '~/constants/endpoints';
import { Broker } from '~/network/responses';
import { useFetch } from '~/network/useFetch';

type Props = {
  callback?: CallbackType;
  isPartial: boolean;
};

const TOP_BROKERS_NUM_COLUMNS = 2;
const TOP_BROKERS_COLUMN_MARGIN = 10;

export const ACATSFromWhere = ({ callback, isPartial }: Props): JSX.Element => {
  const [hideList, setHideList] = useState(true);
  const [textInputValue, setTextInputValue] = useState('');

  const [{ response, error, isLoading }, doFetch] = useFetch(Endpoints.brokers);
  useEffect(() => {
    doFetch();
  }, [doFetch]);

  const institutionSelected = (broker: Broker) => {
    callback &&
      callback({
        type: ActionTypes.NEXT_SCREEN,
        args: {
          institution: broker,
          isPartial,
        },
      });
  };

  const fallbackOption = new Broker('', "I don't see my brokerage firm here...");

  const brokerString = ({ account_name, number }: Broker): string =>
    account_name + (number.length > 0 ? ` - ${number}` : '');

  const filterBrokers = (query: string, data: Broker[]): Broker[] => {
    const brokers = data.filter((broker) => broker.account_name.includes(query));
    brokers.unshift(fallbackOption);
    return brokers;
  };

  const renderSuggestionsItem = ({ item, index }: { item: Broker; index: number }) => (
    <TouchableOpacity
      onPress={() => {
        setTextInputValue(brokerString(item));
        setHideList(true);
        institutionSelected(item);
      }}>
      <Styled.DropdownItem>{brokerString(item)}</Styled.DropdownItem>
    </TouchableOpacity>
  );

  const renderTopBrokersItem: ListRenderItem<Broker> = ({ item, index }) => (
    <Styled.TopBrokersItem
      style={{
        marginRight: index % TOP_BROKERS_NUM_COLUMNS == 0 ? TOP_BROKERS_COLUMN_MARGIN : 0,
      }}
      onPress={() => {
        setTextInputValue(brokerString(item));
        setHideList(true);
        institutionSelected(item);
      }}>
      {item.imgSource && <Styled.TopBrokersLogo resizeMode="contain" source={item.imgSource} />}
    </Styled.TopBrokersItem>
  );

  return (
    <Styled.MainContainer
      onPress={() => {
        setHideList(true);
      }}>
      <Styled.ViewForMainContainer>
        <Styled.NormalText>Search or select a broker below</Styled.NormalText>

        <Styled.Content>
          <Autocomplete
            autoCapitalize="none"
            data={filterBrokers(textInputValue, response as Broker[])}
            hideResults={hideList}
            value={textInputValue}
            onChangeText={setTextInputValue}
            onTouchStart={(event) => {
              setHideList(false);
              event.stopPropagation();
            }}
            placeholder="e.g. Interactive Brokers"
            flatListProps={{
              keyExtractor: (dataItem: Broker) => brokerString(dataItem),
              renderItem: renderSuggestionsItem,
            }}
          />

          <FlatList
            numColumns={TOP_BROKERS_NUM_COLUMNS}
            data={selectedBrokers}
            keyExtractor={(broker: Broker) => broker.number}
            renderItem={renderTopBrokersItem}
          />
        </Styled.Content>
      </Styled.ViewForMainContainer>
    </Styled.MainContainer>
  );
};

const selectedBrokers = [
  new Broker('6769', 'Robinhood Securities, LLC').withImageSource(require('~/assets/images/fund/robinhood_logo.png')),
  // new Broker('0158', 'Webull Financial, LLC').withImageSource(require("./../images/webull_logo.png")),
  new Broker('0385', 'E*Trade Securities LLC').withImageSource(require('~/assets/images/fund/etrade_logo.png')),
  new Broker('0062', 'Vanguard Marketing Corporation').withImageSource(
    require('~/assets/images/fund/vanguard_logo.png'),
  ),
  new Broker('0164', 'Charles Schwab & Co., Inc.').withImageSource(require('~/assets/images/fund/schwab_logo.png')),
  new Broker('0226', 'Fidelity Investments').withImageSource(require('~/assets/images/fund/fidelity_logo.png')),
  new Broker('0671', 'Merrill Lynch, Pierce, Fenner & Smith Incorporated/671 MLPF&S TS PR').withImageSource(
    require('~/assets/images/fund/merrill_logo.png'),
  ),
];
