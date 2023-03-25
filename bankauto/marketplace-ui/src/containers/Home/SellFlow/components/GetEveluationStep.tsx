import React from 'react';
import { SellFlowStep } from './SellFlowStep/SellFlowStep';
import { ReactComponent as IconPrice } from 'icons/iconPrice.svg';
import { ReactComponent as IconPriceDark } from 'icons/iconPriceDark.svg';

type StepProps = {
  dark: boolean;
};

export const GetEvaluationStep = ({ dark }: StepProps) => (
  <SellFlowStep dark={dark} icon={dark ? <IconPriceDark /> : <IconPrice />} title="Узнайте бесплатно онлайн-оценку" />
);
