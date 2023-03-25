import { ApolloProvider } from '@apollo/client';
import Amplify from 'aws-amplify';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { useState } from 'react';
import { NotifierWrapper } from 'react-native-notifier';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as ReduxProvider } from 'react-redux';

import { apolloClient } from '~/amplify/apolloClient';
import { awsconfig } from '~/amplify/awsconfig';
import Navigation from '~/app/home/navigation';
import { StepContainerConfiguration, StepContainerContext } from '~/components/StepContainer/types';
import withAlert from '~/components/hoc/withAlert';
import useCachedResources from '~/hooks/useCachedResources';
import useColorScheme from '~/hooks/useColorScheme';
import { PortalProvider } from '~/providers/Portal';
import store from '~/store/createStore';

Amplify.configure(awsconfig);
Amplify.Logger.LOG_LEVEL = 'DEBUG';

const App = (): null | JSX.Element => {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const [stepContainerState, setStepContainerState] = useState({} as StepContainerConfiguration);

  const initialContext = {
    scState: stepContainerState,
    setSCState: setStepContainerState,
  };

  if (!isLoadingComplete) {
    return null;
  }

  return (
    <ApolloProvider client={apolloClient}>
      <ReduxProvider store={store}>
        <PortalProvider>
          <NotifierWrapper>
            <SafeAreaProvider>
              <StepContainerContext.Provider value={initialContext}>
                <Navigation colorScheme={colorScheme} />
                <StatusBar />
              </StepContainerContext.Provider>
            </SafeAreaProvider>
          </NotifierWrapper>
        </PortalProvider>
      </ReduxProvider>
    </ApolloProvider>
  );
};

export default withAlert(App);
