import React, { FC } from 'react';
import {
  StepsBlockCarIcon,
  StepsBlockHandShakeIcon,
  StepsBlockPresentIcon,
  StepsBlockCashbackIcon,
  StepsBlockNotePencilIcon,
  StepsBlockTicketIcon,
} from 'icons';
import { HomeStepsBlock, StepsBlockItemProps } from 'containers/Home/components';
import { IS_CASHBACK_PROMO, IS_REDMOND_PROMO, IS_STOCK } from 'constants/specialConstants';

const HOME_STEPS_BLOCK_DATA_STOCK = [
  {
    icon: <StepsBlockCarIcon />,
    text: 'Подберите \n и забронируйте \n автомобиль',
  },
  {
    icon: <StepsBlockHandShakeIcon />,
    text: 'Заберите автомобиль \n в дилерском центре',
  },
  {
    icon: <StepsBlockPresentIcon />,
    text: 'Получите бак бензина \n в подарок!*',
  },
] as StepsBlockItemProps[];
const HOME_STEPS_BLOCK_DATA_CASHBACK = [
  {
    icon: <StepsBlockCarIcon />,
    text: 'Подберите \n и забронируйте \n автомобиль',
  },
  {
    icon: <StepsBlockHandShakeIcon />,
    text: 'Заберите автомобиль \n в дилерском центре',
  },
  {
    icon: <StepsBlockCashbackIcon />,
    text: 'Получите  кешбэк \n на ОСАГО!',
  },
];
const HOME_STEPS_BLOCK_DATA_REDMOND = [
  {
    icon: <StepsBlockNotePencilIcon />,
    text: 'Зарегистрируйтесь \n или забронируйте \nавтомобиль',
  },
  {
    icon: <StepsBlockTicketIcon />,
    text: 'Получите промокод \n на 5000 рублей*',
  },
  {
    icon: <StepsBlockPresentIcon />,
    text: 'Выберите технику на \n сайте партнера:',
    link: {
      href: 'https://clck.ru/akqFh',
      title: 'Skymoney Club',
    },
  },
];
const HOME_STEPS_BLOCK_DATA_CASHBACK_MOBILE = IS_STOCK
  ? ['Подберите и забронируйте автомобиль', 'Заберите автомобиль в дилерском центре', 'Получите  кешбэк на ОСАГО!']
  : [];
const steps =
  (IS_STOCK && HOME_STEPS_BLOCK_DATA_STOCK) ||
  (IS_CASHBACK_PROMO && HOME_STEPS_BLOCK_DATA_CASHBACK) ||
  (IS_REDMOND_PROMO && HOME_STEPS_BLOCK_DATA_REDMOND) ||
  [];

export const StepsBlock: FC = () => {
  return <HomeStepsBlock steps={HOME_STEPS_BLOCK_DATA_REDMOND} title="Всего 3 шага" />;
};
