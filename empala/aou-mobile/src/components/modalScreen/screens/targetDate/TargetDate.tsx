import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import DatePicker from 'react-native-modern-datepicker';

import * as s from './targetDateStyles';

import { Routes } from '~/app/home/navigation/routes';
import { RootStackParamList } from '~/app/home/navigation/types';
import { Button } from '~/components/atoms/button';
import { theme } from '~/theme';

type NavigationProps = StackNavigationProp<RootStackParamList, Routes.CreateModal>;
type Props = {
  navigation: NavigationProps,
  backScreen: Routes,
  defaultValue?: string,
};

export const TargetDateModal = ({ navigation, backScreen, defaultValue }: Props): JSX.Element => {
  const [targetDate, setSelectedDate] = useState<Date>(new Date());

  const close = () => {
    navigation.navigate(backScreen, { selectedValue: { targetDate } });
  };

  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
  const isDisabled = (new Date(targetDate) <= new Date()) || (new Date(targetDate) >= oneYearFromNow);

  return (
    <s.Container>
      <s.BodyContainer>
        <DatePicker
          options={{
            backgroundColor: theme.colors.ModalBackground,
            textHeaderColor: 'white',
            textDefaultColor: 'white',
            selectedTextColor: 'black',
            mainColor: 'white',
            textSecondaryColor: theme.formatterColor.Light600,
          }}
          mode="calendar"
          onSelectedChange={setSelectedDate}
          selected={defaultValue}
          current={defaultValue}
        />
      </s.BodyContainer>

      <s.ButtonsContainer>
        <Button title={'Set Date'.toUpperCase()} face="green" onPress={close} disabled={isDisabled} />
      </s.ButtonsContainer>

    </s.Container>
  );
};
