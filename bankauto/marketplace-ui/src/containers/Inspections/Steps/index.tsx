import React, { FC } from 'react';
import { useBreakpoints } from '@marketplace/ui-kit';
import { HomeStepsBlock } from 'containers/Home/components';
import { IconForm, IconPrice, IconPublish } from 'icons/inspections';

const STEPS = [
  { text: 'Выберите автомобиль \nдля диагностики', icon: <IconForm /> },
  { text: 'Оплатите услугу \nспециалиста', icon: <IconPrice /> },
  { text: 'В течение 1 дня \nс вами свяжется эксперт \nи обговорит детали', icon: <IconPublish /> },
  { text: 'Подробный отчет будет \nготов в течение 2 дней', icon: <IconPublish /> },
];

export const StepsBlock: FC = () => {
  const { isMobile } = useBreakpoints();
  return <HomeStepsBlock textVariant="h5" steps={STEPS} title={isMobile ? 'Как получить услугу' : undefined} />;
};
