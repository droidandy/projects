import React, { useCallback } from 'react';

import { Routes } from '~/app/home/navigation/routes';
import { ProfileNavProps } from '~/app/home/navigation/types';
import { GroupHeader } from '~/app/profile/components/GroupHeader';
import { ProfileItem } from '~/app/profile/components/ProfileItem';
import { FaceType } from '~/app/profile/components/profileItemStyles';
import * as s from '~/app/profile/module.styles';
import { SelfCard } from '~/components/atoms/cards';
import { useGetCurrentUserQuery, User } from '~/graphQL/core/generated-types';
import Theme from '~/theme';

const listData = ({ navigate }: { navigate: (route: any) => void }) => [
  {
    title: 'My Universe',
    data: [
      { text: 'Investacks™', onPress: () => navigate(Routes.Stacks) },
      { text: 'Hunches™', onPress: () => navigate(Routes.Hunches) },
      { text: 'Investopeers™', onPress: () => navigate(Routes.Investopeers) },
      { text: 'Accounts', onPress: () => navigate(Routes.NewAccountFlow) },
    ],
  },
  {
    title: 'Settings',
    data: [
      { text: 'Profile' },
      { text: 'Notifications' },
    ],
  },
  {
    title: 'Documents',
    data: [
      { text: 'Submit feedback', onPress: () => navigate(Routes.Documents) },
      { text: 'Help' },
      { text: 'Disclosure' },
      { text: 'Privacy' },
    ],
  },
];

const listHeader = (currentUser: User | undefined) => {
  const {
    userName,
    fullName,
    nStacks,
    nHunches,
    nFollowers,
    avatar,
  } = currentUser || {
    userName: '',
    fullName: '',
    nStacks: 0,
    nHunches: 0,
    nFollowers: 0,
    avatar: '',
  };

  return (
    <s.ListHeader>
      <s.OverscrollBackground />

      <SelfCard
        fullName={fullName}
        userName={userName}
        onPress={() => {}}
        following={nFollowers}
        hunches={nHunches}
        stacks={nStacks}
        source={{ uri: `data:image/png;base64,${avatar}` }}
        withAction
        roundedTop={false}
      />
    </s.ListHeader>
  );
};

type Props = {
  navigation: ProfileNavProps;
};

export const Profile = ({ navigation }: Props): JSX.Element => {
  const navigate = useCallback((route) => navigation.navigate(route), [navigation]);
  const { data } = useGetCurrentUserQuery();

  const currentUser = data?.currentUser?.__typename === 'User' ? data.currentUser as User : undefined;

  return (
    <Theme>
      <s.BlueSafeArea>
        <s.List
          ListHeaderComponent={() => listHeader(currentUser)}
          sections={listData({ navigate })}
          renderSectionHeader={({ section }) => (
            <GroupHeader text={section.title} />
          )}
          keyExtractor={(item) => item.text}
          renderItem={({ item }) => <ProfileItem face={FaceType.primary} {...item} />}
          // without this the header is not shown on app reload
          initialNumToRender={14}
        />
      </s.BlueSafeArea>
    </Theme>
  );
};
