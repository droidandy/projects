import React, { FC } from 'react';
import { useBreakpoints } from '@marketplace/ui-kit';
import { HomeStepsBlock } from 'containers/Home/components';
import { IconChartDark, IconFormDark, IconPriceDark, IconDealDark, IconPublishDark } from 'icons';

const STEPS = [
  { text: 'Заполните информацию \n об автомобиле', icon: <IconFormDark /> },
  { text: 'Узнайте бесплатно \n онлайн-оценку', icon: <IconPriceDark /> },
  { text: 'Опубликуйте объявление \n только для проверенных \n пользователей', icon: <IconPublishDark /> },
  { text: 'Получите предложения и \n выберите лучшее из них', icon: <IconDealDark /> },
  { text: 'Заключите сделку в офисе \n нашего партнера', icon: <IconChartDark /> },
];

export const StepsBlock: FC = () => {
  const { isMobile } = useBreakpoints();
  return <HomeStepsBlock textVariant="h6" steps={STEPS} title={isMobile ? 'Как продать автомобиль' : undefined} />;
};
