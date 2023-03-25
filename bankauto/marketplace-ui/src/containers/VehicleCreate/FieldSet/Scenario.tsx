import React from 'react';
import { SwitchScenario } from './fields/SwitchScenario';

export const VehicleScenarioFieldSet = () => {
  return (
    <>
      <SwitchScenario
        name="isC2C"
        label="Доступно физическим лицам"
        info="Ваше объявление будет опубликовано на #банкавто и доступно для частных лиц"
      />
      <SwitchScenario
        name="isC2B"
        label="Доступно дилерам"
        info="Ваше объявление будет направлено в официальные дилерские центры для выкупа Вашего автомобиля"
      />
    </>
  );
};
