import React, { useCallback } from 'react';
import { TouchableOpacity } from 'react-native';

import { Step } from './Step';
import * as s from './stepIndicatorStyles';
import { BackArrowIcon } from '~/assets/icons';

type Props = {
  totalSteps: number;
  activeIndex: number;
  goPrevStep?: () => void;
};

export const StepIndicator = ({ totalSteps, activeIndex, goPrevStep }: Props): JSX.Element => {
  const backPressHandler = useCallback(() => {
    goPrevStep?.();
  }, [goPrevStep]);

  return (
    <s.MainContainer>
      <TouchableOpacity onPress={backPressHandler}>
        <BackArrowIcon />
      </TouchableOpacity>
      <s.StepsContainer>
        {[...Array<number>(totalSteps)].map((_item, index) => (
          <Step key={index} active={index === activeIndex} />
        ))}
      </s.StepsContainer>
    </s.MainContainer>
  );
};
