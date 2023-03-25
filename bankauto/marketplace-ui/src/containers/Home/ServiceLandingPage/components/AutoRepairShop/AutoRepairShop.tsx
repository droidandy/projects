import React, { FC } from 'react';
import { Button, Divider, Typography } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import { useBreakpoints } from '@marketplace/ui-kit';
import { IconArrowUUpLeft, IconCircleWavyCheck } from 'icons';
import { ReactComponent as PhoneCallIcon } from 'icons/iconPhoneCall.svg';
import { ReactComponent as LocationIcon } from 'icons/iconLocation.svg';
import { Link } from 'components/Link';
import { UserReview } from '../UserReview';
import { useStyles } from './AutoRepairShop.styles';
import { Props } from './types';

export const AutoRepairShop: FC<Props> = ({ item, disabled = true, onPress }) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();

  const onClick = () => onPress && onPress(item.id);

  const renderFeaturesBlock = () => {
    return (
      <div className={s.features}>
        <div className={s.feature}>
          <div className={s.icon}>
            <IconCircleWavyCheck width="1.2rem" height="1.2rem" viewBox="0 0 24 24" />
          </div>
          <Typography variant="body2" color="textSecondary">
            Безопасная сделка
          </Typography>
        </div>
        <div className={s.feature}>
          <div className={s.icon}>
            <IconArrowUUpLeft width="1.2rem" height="1.2rem" viewBox="0 0 24 24" />
          </div>
          <Typography variant="body2" color="textSecondary" component="span">
            Кэшбэк
          </Typography>
        </div>
      </div>
    );
  };

  const renderSchedule = () => {
    const { schedule } = item;

    if (!schedule || Object.keys(schedule).length === 0) {
      return null;
    }

    const isWorkInWeekdays = Boolean(Number(schedule?.weekdays?.is_active));
    const isWorkInWeekends = Boolean(Number(schedule?.weekends?.is_active));
    const isWorkInHolidays = Boolean(Number(schedule?.holidays?.is_active));

    return (
      <>
        <Typography variant="h5" color="textPrimary" component="h4">
          График работы
        </Typography>
        <div>
          {isWorkInWeekdays && (
            <Typography variant="body1" color="textPrimary">
              {`будни - с ${schedule.weekdays.from} до ${schedule.weekdays.to}`}
            </Typography>
          )}
          {isWorkInWeekends && (
            <Typography variant="body1" color="textPrimary">
              {`выходные - с ${schedule.weekends.from} до ${schedule.weekends.to}`}
            </Typography>
          )}
          {isWorkInHolidays && (
            <Typography variant="body1" color="textPrimary">
              {`праздники - с ${schedule.holidays.from} до ${schedule.holidays.to}`}
            </Typography>
          )}
        </div>
      </>
    );
  };

  const renderLeftBlock = () => {
    return (
      <div className={s.cardLeft}>
        <div className={s.block}>
          <Link href={`/service/${item.id}`}>
            <Typography variant="h5" color="textPrimary" component="div" gutterBottom>
              {`Автосервис ${item.name}`}
            </Typography>
          </Link>
          <Rating name="read-only" value={item.service_classification.stars} size="medium" readOnly />
        </div>

        {isMobile && renderFeaturesBlock()}

        <div className={s.block}>
          <div>
            <div className={s.item}>
              <div className={s.icon}>
                <LocationIcon width="1.2rem" height="1.2rem" />
              </div>
              <Typography variant="body2" color="textPrimary" component="span">
                {item.address}
              </Typography>
            </div>

            <div className={s.item}>
              <div className={s.icon}>
                <PhoneCallIcon width="1.2rem" height="1.2rem" />
              </div>
              <Typography variant="body2" color="textPrimary" component="span">
                {item.phone}
              </Typography>
            </div>
          </div>
        </div>
        <div className={s.workSchedule}>{renderSchedule()}</div>
      </div>
    );
  };

  const renderRightBlock = () => {
    return (
      <div className={s.cardRight}>
        <div className={s.userReview}>
          <UserReview rating={item.service_rating.rating} reviewCount={item.service_rating.review_count} />
        </div>
        {!isMobile && renderFeaturesBlock()}
        <Button variant="contained" color="primary" onClick={onClick} disabled={disabled}>
          Записаться
        </Button>
      </div>
    );
  };

  return (
    <div className={s.card}>
      {renderLeftBlock()}
      {!isMobile && <Divider orientation="vertical" flexItem />}
      {renderRightBlock()}
    </div>
  );
};
