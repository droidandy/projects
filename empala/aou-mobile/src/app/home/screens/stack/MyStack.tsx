import React from 'react';

import { BaseStack, Type } from './BaseStack';

import { HomeNavProps } from '~/app/home/navigation/types';

type Props = {
  navigation: HomeNavProps;
};

export const MyStack = (props: Props): JSX.Element => <BaseStack {...props} type={Type.self} />;
