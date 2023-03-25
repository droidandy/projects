import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { FlatList, KeyboardAvoidingView } from 'react-native';

import * as s from './nameStackStyles';

import { Routes } from '~/app/home/navigation/routes';
import { DataFields } from '~/app/home/types/investack';
import { Button } from '~/components/atoms/button';
import { CompanyTicker } from '~/components/atoms/companyTicker';
import { Input } from '~/components/atoms/input';
import { showNotification } from '~/components/atoms/notifier';
import { useAlert } from '~/components/hoc/withAlert';
import { Instrument, useCreateUserStackMutationMutation, ValidationErrorCode } from '~/graphQL/core/generated-types';
import { Company } from '~/graphQL/hooks/useThrottlesCompanySearchQuery';
import Theme from '~/theme';

type Props = {
  subtitle: string;
  [DataFields.selectedCompanies]: Array<Company>,
};

export const NameStack = ({
  subtitle,
  [DataFields.selectedCompanies]: selectedCompanies,
}: Props): JSX.Element => {
  const navigation = useNavigation();
  const alert = useAlert();

  const [stackName, setStackName] = useState<string>('');

  const [createUserStack] = useCreateUserStackMutationMutation();
  const [errorCode, setErrorCode] = useState<ValidationErrorCode | undefined>();

  const toContinue = () => {
    createUserStack({
      variables: {
        createUserStackData: {
          name: stackName,
          instIds: selectedCompanies.map(({ id }) => id),
        },
      },
    }).then((res) => {
      if (res.data?.createUserStack.__typename === 'CreateUserStackSuccess') {
        showNotification({
          title: '✨ Investack™ Created',
          description: `Your new Investack™ “${stackName}” is created.`,
        });

        navigation.navigate(Routes.Home);
      } else if (res.data?.createUserStack.__typename === 'CreateInvalidInputError') {
        if (res.data.createUserStack.errorCode === 'DUPLICATE') {
          setErrorCode(res.data.createUserStack.errorCode);
        } else {
          alert?.({
            title: '✨ Investack™ Creation Error', message: res.data.createUserStack.message,
          });
        }
      } else {
        alert?.({
          title: 'Investack™ creation error.', message: 'Something went wrong.',
        });
      }
    }).catch(() => {
      alert?.({
        title: 'Investack™ creation error.', message: 'Something went wrong.',
      });
    });
  };

  const renderItem = React.useCallback(({ item }: { item: Instrument }) => (
    <CompanyTicker
      key={item.symbol}
      item={item}
    />
  ), []);

  return (
    <Theme>
      <s.Slide>

        <KeyboardAvoidingView
          behavior="padding"
          style={{ flex: 1, width: '100%' }}
        >
          <s.Content>
            <s.Text>{subtitle}</s.Text>
            {errorCode ? (
              <s.Body>
                <s.ErrorContainer>
                  <s.ErrorMessage>Duplicate Investack</s.ErrorMessage>
                  <s.ErrorMessageText>
                    Sorry, this hunch already exists. Please
                    {'\n'}
                    create a unique Hunch
                  </s.ErrorMessageText>
                </s.ErrorContainer>

                <s.Btn>
                  <Button
                    title={'Modify Investack'.toLocaleUpperCase()}
                    face="primary"
                    onPress={() => setErrorCode(undefined)}
                  />
                </s.Btn>
              </s.Body>
            ) : (
              <>
                <s.TextInputContainer>
                  <Input
                    face="primary"
                    label="Investack™ name:"
                    placeholder="Name your Investack™"
                    value={stackName}
                    onChangeText={setStackName}
                  />
                </s.TextInputContainer>

                <s.CounterContainer>
                  <s.CounterTitleContainer>
                    <s.CounterTitle>
                      Companies in
                    </s.CounterTitle>

                    <s.CounterTitle>
                      Investack™
                    </s.CounterTitle>
                  </s.CounterTitleContainer>

                  <s.CounterButton onPress={() => navigation.goBack()}>
                    <s.CounterSticker>
                      <s.CounterStickerText>{selectedCompanies.length}</s.CounterStickerText>
                    </s.CounterSticker>

                    <s.CounterButtionTitle>
                      Add more
                    </s.CounterButtionTitle>
                  </s.CounterButton>
                </s.CounterContainer>

                <s.FlatListContainer>
                  <FlatList
                    data={selectedCompanies}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.symbol}
                  />
                </s.FlatListContainer>

                <s.ButtonContainer>
                  <Button
                    title={'Save Investack™'.toUpperCase()}
                    face="primary"
                    blur={10}
                    onPress={toContinue}
                    disabled={!stackName || !selectedCompanies.length}
                  />
                </s.ButtonContainer>
              </>
            )}
          </s.Content>
        </KeyboardAvoidingView>
      </s.Slide>
    </Theme>
  );
};
