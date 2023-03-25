import React, { useEffect, createRef } from 'react';
import {
  FlatList, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import * as s from './activityDetailsStyles';

import { Activity } from '~/app/home/screens/accountHighlights/tabContent/accountActivity/types';
import { Icon } from '~/components/atoms/icon';
import Theme from '~/theme';

const wait = (timeout: number) => new Promise((resolve) => {
  setTimeout(resolve, timeout);
});

const DATA = [
  { title: 'Status', value: 'Removed' },
  { title: 'Type', value: 'Brokerage Account' },
];

type Props = {
  activity: Activity;
};

export const AccountRemoved = ({ activity }: Props): JSX.Element => {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    wait(2000).then(() => {
      setRefreshing(false);
    }).catch(() => {});
  }, []);

  const flatlistRef = createRef<FlatList<unknown> | undefined>();
  useEffect(() => {
    flatlistRef.current?.scrollToOffset({
      animated: false,
      offset: -200,
    });
  }, []);

  const headerComponent = () => (
    <s.HeaderContainer>
      <s.TitleContainer>
        <s.Title>
          BROKERAGE ACCOUNT
          {' '}
          <s.TitleGrey>
            REMOVED
          </s.TitleGrey>
        </s.Title>

        <Icon name="orderType" size={27} />
      </s.TitleContainer>

      <s.SubTitle>Citadel</s.SubTitle>
      <s.DateTitle>12/28/2021</s.DateTitle>
    </s.HeaderContainer>
  );

  const footerComponent = () => (
    <s.FooterContainer />
  );

  const renderItem = ({ item }: { item: { title: string, value: string } }) => (
    <s.ItemContainer>
      <s.ItemText>{item.title}</s.ItemText>
      <s.ItemValue>{item.value}</s.ItemValue>
    </s.ItemContainer>
  );

  return (
    <Theme>
      <SafeAreaView edges={['top', 'bottom']}>
        <s.FlatList
          ref={flatlistRef}
          showsVerticalScrollIndicator={false}
          initialNumToRender={2}
          data={DATA}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          keyExtractor={(item) => item.value}
          ListHeaderComponent={headerComponent}
          ListFooterComponent={footerComponent}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <s.Separator />}
        />
      </SafeAreaView>
    </Theme>
  );
};
