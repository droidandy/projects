import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import { Routes } from './routes';
import { ProfileParamList } from './types';

import { Profile, EditProfile, Feedback } from '~/app/profile/screens';
import { BackButton } from '~/components/atoms/backIcon/BackIcon';
import { theme } from '~/theme';

const ProfileStack = createStackNavigator<ProfileParamList>();

export function ProfileNavigator(): JSX.Element {
  return (
    <ProfileStack.Navigator
      screenOptions={{ headerShown: false }}
    >
      <ProfileStack.Screen name={Routes.ProfileScreen} component={Profile} />
      <ProfileStack.Screen name={Routes.EditProfileScreen} component={EditProfile} />
      <ProfileStack.Screen
        name={Routes.Feedback}
        component={Feedback}
        options={{
          headerBackImage: BackButton,
          headerBackTitleVisible: false,
          title: 'Feedback',
          headerTitleStyle: { color: theme.colors.White },
          headerShown: true,
          headerTransparent: true,
        }}
      />
    </ProfileStack.Navigator>
  );
}
