import React from 'react';
import { SellFlowStep } from './SellFlowStep/SellFlowStep';
import { ReactComponent as IconPublish } from 'icons/iconPublish.svg';
import { ReactComponent as IconPublishDark } from 'icons/iconPublishDark.svg';

type StepProps = {
  dark: boolean;
};

export const PublishStep = ({ dark }: StepProps) => (
  <SellFlowStep
    dark={dark}
    icon={dark ? <IconPublishDark /> : <IconPublish />}
    title="Опубликуйте объявление только для проверенных пользователей"
  />
);
