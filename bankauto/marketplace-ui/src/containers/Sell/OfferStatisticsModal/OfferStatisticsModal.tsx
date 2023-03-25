import React, { FC, useMemo } from 'react';
import { Typography } from '@marketplace/ui-kit';
import { ModalLight } from 'components/ModalLight/ModalLight';
import { CalendarIcon, EyeIcon, HeartIcon, PhoneIcon, CarIcon } from 'icons/clientVehicleStatistic';
import { useStyles } from './OfferStatisticsModal.styles';
import { useOfferStatisticsContext } from './OfferStatisticsContext';

type StatisticsItemProps = {
  title: string;
  count: number;
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
};

const StatisticsItem: FC<StatisticsItemProps> = ({ title, count, icon: Icon }) => {
  const s = useStyles();
  return (
    <div className={s.statisticsItem}>
      <div className={s.iconWrapper}>
        <Icon viewBox="0 0 32 32" className={s.icon} />
      </div>
      <div>
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        <Typography color="textSecondary">{count}</Typography>
      </div>
    </div>
  );
};

export const OfferStatisticsModal: FC = () => {
  const { root } = useStyles();
  const { statistics, isOpen, toggleOpen } = useOfferStatisticsContext();

  const statisticsData = useMemo(
    (): JSX.Element[] => [
      <StatisticsItem title="Общее количество просмотров" count={statistics.totalViews} icon={EyeIcon} />,
      <StatisticsItem title="Количество просмотров за 7 дней" count={statistics.weeklyViews} icon={CalendarIcon} />,
      <StatisticsItem title="Количество запросов телефона" count={statistics.phoneRequests} icon={PhoneIcon} />,
      <StatisticsItem title="Количество добавлений в избранное" count={statistics.favoritesCount} icon={HeartIcon} />,
      <StatisticsItem title="Количество добавлений в сравнение" count={statistics.comparedCount} icon={CarIcon} />,
      <StatisticsItem
        title="Количество дней с момента публикации"
        count={statistics.daysPublished}
        icon={CalendarIcon}
      />,
      //https://jira.rgsbank.ru/browse/MKP-6731 не будем отображать до тех пор, пока кол-во заявок на нашем сайте не станет достаточно большим.
      // <StatisticsItem
      //   title="Количество дней оставшихся до окончания публикации"
      //   count={statistics.daysTillUnpublish}
      //   icon={CalendarIcon}
      // />,
    ],
    [statistics],
  );
  return (
    <ModalLight key="auth" isOpen={isOpen} handleOpened={toggleOpen} onClose={toggleOpen} classes={{ root }}>
      {statisticsData}
    </ModalLight>
  );
};
