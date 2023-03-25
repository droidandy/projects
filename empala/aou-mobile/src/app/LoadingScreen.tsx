import React, { useEffect, useMemo, useState } from 'react';
import Config from 'react-native-config';
import styled from 'styled-components/native';

import { useGetInvestopeersQuery, useGetThemesQuery } from '~/graphQL/core/generated-types';
import { useLogin } from '~/network/useLogin';
import { welcome } from '~/store/auth';
import { useAppDispatch } from '~/store/hooks';

const GUEST_USER_CREDENTIALS = {
  username: Config.GUEST_USER_USERNAME,
  password: Config.GUEST_USER_PASSWORD,
};

const Container = styled.View`
  flex: 1;
  background-color: #fff;
  justify-content: center;
`;

export const LoadingScreen = (): JSX.Element => {
  const [{ response: loggedInUser }, doLogin] = useLogin(false);

  useEffect(() => {
    const { username, password } = GUEST_USER_CREDENTIALS;
    doLogin({ username, password });
  }, []);

  return loggedInUser ? <NotLoggedInContainer /> : <Container />;
};

const NotLoggedInContainer = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const [loadingStarted, setLoadingStarted] = useState(false);

  const { loading: preloadingInterests } = useGetThemesQuery();
  const { loading: preloadingInvestopeers } = useGetInvestopeersQuery();

  useEffect(() => {
    if (preloadingInterests && preloadingInvestopeers) setLoadingStarted(true);
  }, [preloadingInterests, preloadingInvestopeers]);

  const loaded = useMemo(
    () => (loadingStarted && !(preloadingInterests || preloadingInvestopeers)),
    [preloadingInterests, preloadingInvestopeers, loadingStarted],
  );

  useEffect(() => {
    loaded && dispatch(welcome());
  }, [loaded]);

  return <Container />;
};
