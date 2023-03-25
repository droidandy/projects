import React, { memo, FC } from 'react';
import { Typography, useBreakpoints } from '@marketplace/ui-kit';
import { Inspection } from 'types/Inspection';
import { Link } from 'components';
import { Chips } from 'containers/PersonalArea/components';
import { INSPECTION_CHIP_RECORD } from '../constants';
import { useStyles } from './AdsCardExpocarContainer.styles';

type Props = {
  link: string;
  inspection: Inspection;
};

export const InspectionInfo: FC<Props> = memo(({ link, inspection: { id: inspectionId, status } }) => {
  const { isMobile } = useBreakpoints();
  const s = useStyles();

  const chipsJsx = <Chips items={INSPECTION_CHIP_RECORD[status]} />;

  const orderNumber = (
    <Typography variant={'h5'} component="p" color="textSecondary">
      {!isMobile && 'Заявка '}№ {inspectionId}
    </Typography>
  );

  const header = (
    <>
      <div className={s.titleWrapper}>
        <Typography variant={isMobile ? 'h5' : 'h3'} component="p" className={s.title}>
          Заявка на осмотр
        </Typography>
        {isMobile ? orderNumber : chipsJsx}
      </div>
      {isMobile ? chipsJsx : orderNumber}
    </>
  );

  return (
    <div className={s.inspectionInfoWrapper}>
      {header}
      <Link href={link}>
        <Typography variant="h5" component="p" color="primary" className={s.aboutLink}>
          Подробнее об услуге
        </Typography>
      </Link>
    </div>
  );
});
