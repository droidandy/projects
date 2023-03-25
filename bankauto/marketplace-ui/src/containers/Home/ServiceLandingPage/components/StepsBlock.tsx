import React from 'react';
import { ContainerWrapper } from '@marketplace/ui-kit';
import { HomeStepsBlock } from 'containers/Home/components';
import { NotePencil, Form, Calendar } from 'icons/service';

const STEPS = [
  {
    text: 'Создайте заявку',
    subText: 'Напишите, какую работу \nтребуется произвести',
    icon: <NotePencil />,
  },
  {
    text: 'Выберите удобную дату',
    subText: 'Укажите дату и время, когда вам будет удобно сдать ваш автомобиль в сервисный центр',
    icon: <Calendar />,
  },
  {
    text: 'Получите лучшие предложения',
    subText: 'Отправьте заявку и получите предложения от сервисных центров',
    icon: <Form />,
  },
];

export const StepsBlock = React.memo(() => (
  <ContainerWrapper pt={3.75} pb={3.75}>
    <HomeStepsBlock steps={STEPS} title="Закажите услугу не выходя из дома" />
  </ContainerWrapper>
));
