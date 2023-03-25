import React from 'react';
import { SellFlowStep } from './SellFlowStep/SellFlowStep';
import { ReactComponent as IconChart } from 'icons/iconChart.svg';
import { ReactComponent as IconChartDark } from 'icons/iconChartDark.svg';

type StepProps = {
  dark: boolean;
};

export const ChooseOfferStep = ({ dark }: StepProps) => (
  <SellFlowStep
    dark={dark}
    icon={dark ? <IconChartDark /> : <IconChart />}
    title="Получите предложения и выберите лучшее из них"
  />
);
