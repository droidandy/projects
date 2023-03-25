import React from 'react';
import { StepBlock } from 'components/StepBlock/StepBlock';
import { IconCalendar, IconCalculatorColor, IconLaptopOnline } from 'icons';
import cx from 'classnames';
import { Typography, useBreakpoints } from '@marketplace/ui-kit';
import { StepsWrapper } from '../components/StepsWrapper/StepsWrapper';
import { useStyles } from './InstallmentSteps.styles';

export const InstallmentSteps = () => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();
  const customClasses = {
    root: s.stepsItemWrapper,
    text: s.stepsItemText,
    content: s.stepsItemTextWrapper,
    icon: s.icon,
  };
  const InstallmentStep1 = () => {
    return (
      <StepBlock
        icon={{ component: IconCalculatorColor, viewBox: '0 0 48 48' }}
        text="Переплата 0%"
        classes={customClasses}
      />
    );
  };

  const InstallmentStep2 = () => {
    return (
      <StepBlock
        text={'Одобрение\n онлайн'}
        icon={{ component: IconLaptopOnline, viewBox: '0 0 48 48' }}
        classes={customClasses}
      />
    );
  };

  const InstallmentStep3 = () => {
    return (
      <StepBlock
        text={'Фиксированный\n платеж'}
        icon={{ component: IconCalendar, viewBox: '0 0 48 48' }}
        classes={customClasses}
      />
    );
  };
  const steps = [<InstallmentStep1 />, <InstallmentStep2 />, <InstallmentStep3 />];

  return (
    <>
      {isMobile && (
        <Typography variant="h4" align="center">
          Автомобиль в рассрочку
        </Typography>
      )}
      <StepsWrapper blocks={steps} className={cx(s.stepsBlockWrapper, s.infoWrapper)} />
    </>
  );
};
