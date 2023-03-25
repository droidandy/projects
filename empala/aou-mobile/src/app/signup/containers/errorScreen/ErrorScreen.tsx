import { RouteProp } from '@react-navigation/native';
import React, { useEffect, useContext } from 'react';

import * as s from './errorScreenStyles';

import { Routes } from '~/app/home/navigation/routes';
import { OnboardingNavProps, OnboardingParamList } from '~/app/home/navigation/types';
import { useHandleQueryData } from '~/app/signup/fetchDataManager';
import { useOnboardingLoader } from '~/app/signup/hooks';
import { StepContainerContext } from '~/components/StepContainer/types';
import { Button } from '~/components/atoms/button';
import Theme from '~/theme';

type RouteProps = RouteProp<OnboardingParamList, Routes.OnboardingError>;

type Props = {
  navigation: OnboardingNavProps;
  route: RouteProps;
};

export const ErrorScreen = ({ navigation, route }: Props): JSX.Element => {
  const { screen } = route.params;

  const {
    loading, data, refetch,
  } = useHandleQueryData(screen);

  const setLoading = useOnboardingLoader();
  const { setSCState } = useContext(StepContainerContext);

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (data) {
      // force rerender
      setSCState((prev) => ({ ...prev }));
      navigation.goBack();
    }
  }, [data, navigation]);

  return (
    <Theme>
      <s.SafeArea>
        <s.Content>
          <s.Image name="exclaim" size={140} />
          <s.Title>
            Error occured
          </s.Title>
          <s.Subtitle>
            Something went wrong. Please try again.
          </s.Subtitle>
        </s.Content>
        <s.Btn>
          <Button
            loading={loading}
            title="TRY AGAIN"
            face="primary"
            onPress={() => refetch()}
          />
        </s.Btn>
      </s.SafeArea>
    </Theme>
  );
};
