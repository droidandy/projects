import React, { useCallback } from 'react';

import * as s from './investopeersStyles';

import { Routes } from '~/app/home/navigation/routes';
import { HomeNavProps } from '~/app/home/navigation/types';
import { Button } from '~/components/atoms/button';
import { ButtonWithIcon } from '~/components/atoms/buttonWithIcon';
import { TabBar } from '~/components/atoms/tabBar';
import { User, useDeleteUserFollowsMutation } from '~/graphQL/core/generated-types';
import { useQueryAndRefetchWhenFocused, QueryKeys } from '~/graphQL/hooks/useQueryAndRefetchWhenFocused';
import Theme from '~/theme';

type Props = {
  navigation: HomeNavProps;
};
enum Tabs {
  FOLLOWERS = 1,
  FOLLOWING = 2,
}

const tabs = [{ label: 'Followers', id: Tabs.FOLLOWERS }, { label: 'Following', id: Tabs.FOLLOWING }];

export const Investopeers = ({ navigation }: Props): JSX.Element => {
  const [activeTab, setActiveTab] = React.useState<Tabs>(Tabs.FOLLOWERS);
  const navigate = useCallback((route) => navigation.navigate(route), [navigation]);

  const createInvestack = () => navigate(Routes.CreateStackFlow);

  const { data, refetch } = useQueryAndRefetchWhenFocused(QueryKeys.GetCurrentUserDocument);
  const [deleteUserFollowsMutation] = useDeleteUserFollowsMutation();

  const unFollowUser = (id: string) => {
    deleteUserFollowsMutation({
      variables: {
        deleteUserFollowsUserFollowIds: id,
      },
    }).then(() => {
      refetch().catch(() => {});
    }).catch(() => {});
  };

  const renderItem = React.useCallback(
    (tab: Tabs, item: User) => (
      <s.Card key={item.id}>
        <s.Avatar source={{ uri: `data:image/png;base64,${item.avatar}` }} resizeMode="cover" />

        <s.Title>
          @
          {item.userName}
        </s.Title>

        <s.ButtonContainer>
          {tab === Tabs.FOLLOWING ? (
            <ButtonWithIcon icon="trash" onPress={() => unFollowUser(item.id)} />
          ) : null}
        </s.ButtonContainer>
      </s.Card>
    ),
    [],
  );

  const followersUsers = data?.currentUser?.__typename === 'User' ? data.currentUser.followers : null;
  const followedUsers = data?.currentUser?.__typename === 'User' ? data.currentUser.followedUsers : null;

  const listUsers = activeTab === Tabs.FOLLOWERS ? followersUsers : followedUsers;

  const renderSeparator = () => (
    <s.Separator />
  );

  return (
    <Theme>
      <s.GradientLayerInner>
        <s.SafeArea edges={['bottom']}>
          <s.Content>
            <s.TextInputContainer>
              <s.Row>
                <TabBar activeTab={activeTab} tabs={tabs} onTabChange={setActiveTab} />
              </s.Row>
            </s.TextInputContainer>

            <s.FlatList<User>
              ItemSeparatorComponent={renderSeparator}
              keyExtractor={(item: User) => item.id}
              data={listUsers}
              extraData={activeTab}
              renderItem={({ item }) => renderItem(activeTab, item)}
            />
          </s.Content>
        </s.SafeArea>
      </s.GradientLayerInner>
    </Theme>
  );
};
