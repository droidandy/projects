import * as React from 'react';
import { useCallback } from 'react';

import * as s from './module.styles';

import { ActionTypes, CallbackType, Meta } from '~/components/StepContainer/types';
import { Badge } from '~/components/atoms/badge';
import { Button } from '~/components/atoms/button';
import { Header } from '~/components/molecules/header';
import { StepIndicator } from "~/components/molecules/stepIndicator";
import { useNavigation } from "@react-navigation/native";

export type BadgeScreenProps = {
  callback?: CallbackType;
  title: string;
  subtitle: string;
  badgeTitle: string;
  badgeIcon: string;
  meta: Meta;
};

export const BadgeScreen = ({
  callback,
  title,
  subtitle,
  badgeTitle,
  badgeIcon,
  meta
}: BadgeScreenProps): JSX.Element => {
  const toContinue = useCallback(() => {
    callback?.({
      type: ActionTypes.NEXT_SCREEN,
    });
  }, [callback]);

  const navigation = useNavigation();
  const goBack = () => navigation.goBack();

  return (
    <>
      <s.Slide>
        <Header title={title} subtitle={subtitle} />
        <Badge title={badgeTitle} iconName={badgeIcon} />
        <s.ButtonContainer>
          <Button disabled={false} title="Continue" face="primary" onPress={toContinue} />
        </s.ButtonContainer>
      </s.Slide>
      <StepIndicator
        totalSteps={meta.totalScreens}
        activeIndex={meta.screenIndex}
        goPrevStep={goBack}
      />
    </>
  );
};
