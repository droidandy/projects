import React, { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import Config from 'react-native-config';
import { PlaidLink, LinkSuccess, LinkExit, PlaidEnvironment, PlaidProduct } from 'react-native-plaid-link-sdk';

import { Endpoints } from '~/constants/endpoints';
import { usePost } from '~/network/useFetch';

type Props = {
  children?: React.ReactNode;
};

export const PlaidComponent = ({ children }: Props): JSX.Element => {
  const [{ response: linkToken, error, isLoading }, doFetch] = usePost(Endpoints.linkToken);
  useEffect(() => {
    doFetch({
      body: { aouHost: Config.PLAID_AOU_HOST },
    });
  }, [doFetch]);

  return linkToken ? (
    <PlaidLink
      tokenConfig={{
        token: linkToken,
      }}
      publicKeyConfig={{
        clientName: Config.PLAID_CLIENT_NAME,
        environment: PlaidEnvironment.SANDBOX,
        publicKey: Config.PLAID_PUBLIC_KEY,
        products: [PlaidProduct.AUTH, PlaidProduct.TRANSACTIONS],
        language: 'en',
        countryCodes: ['us'],
      }}
      onSuccess={(success: LinkSuccess) => {
        console.log(success);
      }}
      onExit={(exit: LinkExit) => {
        console.log(exit);
      }}>
      {children}
    </PlaidLink>
  ) : (
    <ActivityIndicator size="large" color="#55a333" />
  );
};
