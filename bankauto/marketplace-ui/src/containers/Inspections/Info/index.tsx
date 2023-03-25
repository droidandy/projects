import React, { FC, memo } from 'react';
import { InfoItemsList } from './InfoItemsList';
import { INFO_DATA, INSPECTIONS_RESULTS } from '../constants';
import { useStyles } from '../Inspections.styles';

export const Info: FC = memo(() => {
  const s = useStyles();
  return (
    <>
      <InfoItemsList
        items={INFO_DATA}
        title={'Что проверит эксперт'}
        titleWrapperClass={s.infoTitle}
        className={s.infoSection}
      />
      <InfoItemsList
        items={INSPECTIONS_RESULTS}
        title={'Результат диагностики'}
        titleWrapperClass={s.title}
        className={s.inspectionsInfoSection}
      />
    </>
  );
});
