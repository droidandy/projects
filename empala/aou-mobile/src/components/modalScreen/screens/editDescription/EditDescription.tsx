import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';

import * as s from './editDescriptionStyles';

import { Routes } from '~/app/home/navigation/routes';
import { RootStackParamList } from '~/app/home/navigation/types';
import { Button } from '~/components/atoms/button';

type NavigationProps = StackNavigationProp<RootStackParamList, Routes.CreateModal>;
type Props = {
  navigation: NavigationProps,
  backScreen: Routes,
  defaultValue?: string,
};

export const EditDescriptionModal = ({ navigation, backScreen, defaultValue }: Props): JSX.Element => {
  const [description, SetDescription] = useState<string>();
  const close = () => {
    navigation.navigate(backScreen, { selectedValue: { description } });
  };

  useEffect(() => {
    SetDescription(defaultValue);
  }, []);

  return (
    <s.Container>
      <s.BodyContainer>
        <s.EditField
          multiline
          autoFocus
          maxLength={120}
          defaultValue={defaultValue}
          onChangeText={SetDescription}
        />
      </s.BodyContainer>

      <s.ButtonsContainer>
        <Button title={'Set description'.toUpperCase()} face="green" onPress={close} />
      </s.ButtonsContainer>

    </s.Container>
  );
};
