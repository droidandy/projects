import { useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { useContext, useEffect } from 'react';

import { fetchDataConfig } from './config';

import { OnboardingScreens, Routes } from '~/app/home/navigation/routes';
import { OnboardingNavProps } from '~/app/home/navigation/types';
import { StepContainerContext } from '~/components/StepContainer/types';

export const fetchDataManager = (screen: OnboardingScreens): string | any[] | Record<string, unknown> => {
  const navigation = useNavigation<OnboardingNavProps>();
  const { error, readyData } = useHandleQueryData(screen);

  useEffect(() => {
    error && navigation.navigate(Routes.OnboardingError, { screen });
  }, [error]);

  return readyData;
};

export const useHandleQueryData = (screen: OnboardingScreens) => {
  const { scState } = useContext(StepContainerContext);

  const config = fetchDataConfig[screen]!;

  const { prepareArgsFunc, handleDataFunc, gqlDoc } = config;
  const variables: Record<string, unknown> | undefined = prepareArgsFunc?.(scState);
  const {
    loading, error, data, refetch,
  } = useQuery(gqlDoc, variables && { variables });

  const readyData = handleDataFunc(data);

  return {
    loading, error, data, readyData, refetch,
  };
};
