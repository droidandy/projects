import React from 'react';
import { SellFlowStep } from './SellFlowStep/SellFlowStep';
import { ReactComponent as IconForm } from 'icons/iconForm.svg';
import { ReactComponent as IconFormDark } from 'icons/iconFormDark.svg';

type StepProps = {
  dark: boolean;
};

export const FillFormStep = ({ dark }: StepProps) => (
  <SellFlowStep dark={dark} icon={dark ? <IconFormDark /> : <IconForm />} title="Заполните информацию об автомобиле" />
);
