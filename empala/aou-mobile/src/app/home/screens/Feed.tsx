import filter from 'lodash.filter';
import React, { useCallback } from 'react';

import * as s from '../module.styles';

import { FeedNavProps } from '~/app/home/navigation/types';
import { fakeAvatar } from '~/app/profile/screens/Profile';
import { NotificationCard } from '~/components/atoms/cards';
import { TabBar } from '~/components/atoms/tabBar';
import Theme from '~/theme';

export type Props = {
  navigation: FeedNavProps;
};

const feed = [
  {
    fullName: 'Stevie Wonder',
    userName: 'stevie',
    source: { uri: fakeAvatar },
    type: 'investopeer',
    latestTime: '2h ago',
    description: 'started following you and liked your tweets.',
  },
  {
    fullName: 'Jordan Belfort',
    userName: 'wolfwst',
    source: { uri: fakeAvatar },
    type: 'hunch',
    latestTime: '2h ago',
    description: 'started following you and liked your tweets.',
  },
  {
    fullName: 'Raoul Duke',
    userName: 'raoulduke',
    source: { uri: fakeAvatar },
    type: 'stack',
    latestTime: '2h ago',
    description: 'started following you and liked your tweets.',
  },
];

const tabs = [
  { label: 'Investopeers', id: 1, type: 'investopeer' },
  { label: 'Stacks', id: 2, type: 'stack' },
  { label: 'Hunches', id: 3, type: 'hunch' },
  { label: 'All', id: 4 },
];

export const Feed = ({ navigation }: Props): JSX.Element => {
  const [activeTab, setActiveTab] = React.useState<number>(1);
  const keyExtractor = useCallback((item) => `${item.userName || item.fullName}`, []);
  const find = tabs.find((i) => i.id === activeTab);

  const data = filter(feed, (el) => (find?.type ? el.type === find.type : true));

  const renderCard = React.useCallback(
    () => ({ item, index }: { item: any; index: number; }) => (
      <NotificationCard key={index} {...item} />
    ),
    [],
  );

  return (
    <Theme>
      <s.GradientLayer>
        <s.SafeArea>
          <s.HeaderWP>
            <s.HeaderContent>
              <s.HeaderIconsContent />

              <s.Label>Feed</s.Label>

              <s.HeaderIconsContent />
            </s.HeaderContent>
          </s.HeaderWP>
          <s.Row>
            <TabBar activeTab={activeTab} tabs={tabs} onTabChange={setActiveTab} />
          </s.Row>
          <s.Feed
            keyExtractor={keyExtractor}
            data={data}
            renderItem={renderCard()}
            ItemSeparatorComponent={() => <s.Divider1 />}
          />
        </s.SafeArea>
      </s.GradientLayer>
    </Theme>
  );
};
