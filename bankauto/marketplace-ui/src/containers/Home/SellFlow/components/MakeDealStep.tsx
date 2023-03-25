import React from 'react';
import { SellFlowStep } from './SellFlowStep/SellFlowStep';
import { ReactComponent as IconDeal } from 'icons/iconDeal.svg';
import { ReactComponent as IconDealDark } from 'icons/iconDealDark.svg';

type StepProps = {
  dark: boolean;
};

export const MakeDealStep = ({ dark }: StepProps) => (
  <SellFlowStep
    dark={dark}
    icon={dark ? <IconDealDark /> : <IconDeal />}
    title="Заключите сделку в офисе нашего партнера"
  />
);
