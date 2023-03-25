import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';

import { TargetDateButton } from './components/targetDateButton';
import { TargetPriceButton } from './components/targetPriceButton';
import { TickerComponent } from './components/ticker';
import * as s from './setPriceAndDateStyles';

import { Routes } from '~/app/home/navigation/routes';
import { CommonRoutesParamList } from '~/app/home/navigation/types';
import { DataFields } from '~/app/home/types/hunch';
import { Button } from '~/components/atoms/button';
import { showNotification } from '~/components/atoms/notifier';
import { useAlert } from '~/components/hoc/withAlert';
import { useModal } from '~/components/modalScreen/useModal';
import { Modals, ModalParams, ModalsInitialValues } from '~/constants/modalScreens';
import { useCreateUserHunchMutation, ValidationErrorCode } from '~/graphQL/core/generated-types';
import { Company } from '~/graphQL/hooks/useThrottlesCompanySearchQuery';
import Theme from '~/theme';

type Props = {
  subtitle: string;
  [DataFields.selectedCompany]: Company,
};

export const SetPriceAndDate = ({
  subtitle,
  [DataFields.selectedCompany]: selectedCompany,
}: Props): JSX.Element => {
  const [value, setValue] = React.useState<ModalParams>(ModalsInitialValues);
  const [{ selectedValue }, showModal] = useModal();
  const alert = useAlert();
  const navigation = useNavigation<NavigationProp<CommonRoutesParamList>>();
  const [createUserHunchMutation] = useCreateUserHunchMutation();
  const [errorCode, setErrorCode] = useState<ValidationErrorCode | undefined>();

  React.useEffect(() => {
    if (selectedValue) {
      setValue({
        ...value,
        ...selectedValue,
      });
    }
  }, [selectedValue]);

  const toContinue = () => {
    if (value && value.targetDate && value.targetPrice) {
      createUserHunchMutation({
        variables: {
          createUserHunchData: {
            targetPrice: Number(value.targetPrice),
            instId: selectedCompany.id,
            byDate: value.targetDate,
          },
        },
      }).then((res) => {
        if (res.data?.createUserHunch?.__typename === 'CreateInvalidInputError') {
          if (res.data.createUserHunch.errorCode === 'DUPLICATE') {
            setErrorCode(res.data.createUserHunch.errorCode);
          } else {
            alert?.({
              title: 'Hunch™ creation error.', message: res.data?.createUserHunch?.message,
            });
          }
        } else if (res.data?.createUserHunch?.__typename === 'CreateUserHunchSuccess') {
          showNotification({
            title: '✨ Hunch™ Created',
            description: `Your new Hunch™ for ${selectedCompany.symbol} is created.`,
          });
          navigation.navigate(Routes.Home);
        } else {
          alert?.({
            title: 'Hunch™ creation error.', message: 'Something went wrong.',
          });
        }
      }).catch((err) => {
        alert?.({
          title: 'Error', message: 'Something went wrong.',
        });
      });
    }
  };

  const selectTargetPrice = () => {
    showModal({
      activeModal: Modals.TargetPrice,
      defaultValues: value.targetPrice ? value : { ...value, targetPrice: selectedCompany.currentPrice },
    });
  };

  const selectTargetDate = () => {
    showModal({ activeModal: Modals.TargetDate, defaultValues: value });
  };

  const { targetPrice, targetDate } = value;

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  const isButtonDisabled = !(value.targetDate && value.targetPrice);
  const percent = selectedCompany.currentPrice
    ? targetPrice && (((targetPrice - selectedCompany.currentPrice) * 100) / selectedCompany.currentPrice) : 0;

  return (
    <Theme>
      <s.Slide>
        <s.Content>
          <s.Text>{subtitle}</s.Text>
          {errorCode
            ? (
              <s.Body>
                <s.ErrorContainer>
                  <s.ErrorMessage>Duplicate Hunch</s.ErrorMessage>
                  <s.ErrorMessageText>
                    Sorry, this hunch already exists. Please
                    {'\n'}
                    create a unique Hunch
                  </s.ErrorMessageText>
                </s.ErrorContainer>

                <s.Btn>
                  <Button
                    title={'Modify hunch'.toLocaleUpperCase()}
                    face="primary"
                    onPress={() => setErrorCode(undefined)}
                  />
                </s.Btn>
              </s.Body>
            )
            : (
              <s.Body>
                <TickerComponent ticker={selectedCompany} />

                <s.ButtonsContainer>
                  <TargetPriceButton
                    title="Select target price"
                    value={targetPrice}
                    percent={percent}
                    onPress={selectTargetPrice}
                  />
                  <TargetDateButton
                    title="Select target date"
                    value={targetDate && new Date(targetDate).toLocaleDateString('en-US', options)}
                    onPress={selectTargetDate}
                  />
                </s.ButtonsContainer>

                <s.Btn>
                  <Button
                    disabled={isButtonDisabled}
                    title={'Create Hunch'.toLocaleUpperCase()}
                    face="primary"
                    onPress={toContinue}
                  />
                </s.Btn>
              </s.Body>
            )}

        </s.Content>

      </s.Slide>
    </Theme>
  );
};
