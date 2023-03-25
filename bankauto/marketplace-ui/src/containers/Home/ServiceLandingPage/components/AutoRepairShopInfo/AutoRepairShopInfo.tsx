import React, { useMemo, FC } from 'react';
import cx from 'classnames';
import { useRouter } from 'next/router';
import { Button, Typography } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import { ContainerWrapper, Icon, Img } from '@marketplace/ui-kit';
import { Link } from 'components';
import Wrapper from 'components/Wrapper';
import { useService, useReviewsById } from '../../hooks/api';
import { ReactComponent as PhoneCallIcon } from 'icons/iconPhoneCall.svg';
import { ReactComponent as LocationIcon } from 'icons/iconLocation.svg';
import { ReactComponent as WifiIcon } from 'icons/iconWifi.svg';
import { ReactComponent as WcIcon } from 'icons/iconWc.svg';
import { ReactComponent as MonitorIcon } from 'icons/iconMonitor.svg';
import { ReactComponent as ParkingIcon } from 'icons/iconParking.svg';
import { ReactComponent as CreditCardIcon } from 'icons/CreditCard.svg';
import { UserReview } from '../UserReview';
import { Reviews } from '../Reviews/Reviews';
import { ServiceSlider } from '../ServiceSlider/ServiceSlider';
import { useStyles } from './AutoRepairShopInfo.styles';
import { Amenity, File, Image, WorkType } from './types';

const DEFAULT_AMENITIES: Amenity = {
  phone: { icon: PhoneCallIcon, title: 'Телефон' },
  wifi: { icon: WifiIcon, title: 'Wi-Fi' },
  tv: { icon: MonitorIcon, title: 'Телевизор' },
  evacuator: { icon: LocationIcon, title: 'Эвакуатор' },
  parking: { icon: ParkingIcon, title: 'Паркинг' },
  toilet: { icon: WcIcon, title: 'Туалет' },
  pay_card: { icon: CreditCardIcon, title: 'Оплата картой' },
};

export const AutoRepairShopInfo: FC = (props) => {
  const router = useRouter();
  const serviceId = router.query.id as string;
  const { isLoading, isSuccess, data: items } = useService(serviceId);
  const data = (items as any)?.data;
  const { isSuccess: isReviewsSuccess, data: reviewsData } = useReviewsById(serviceId);
  const reviews = (reviewsData as any)?.data?.reviews || [];
  const s = useStyles();
  const videoElements = useMemo(() => {
    if (!data && !data?.files) {
      return [];
    }

    return data?.files?.map((file: File) => (
      <div key={file.id} className={s.box}>
        <video key={file.id} src={file.url} controls preload="auto" controlsList="nodownload" />
      </div>
    ));
  }, [data?.files]);

  const imageElements = useMemo(() => {
    if (!data && !data?.images) {
      return [];
    }

    return data?.images?.map((image: Image) => (
      <div key={image.id} className={s.box}>
        <Img src={image.thumb_preview} alt="image" />
      </div>
    ));
  }, [data?.images]);

  const slides = [...videoElements, ...imageElements];

  const renderSchedule = () => {
    const { schedule } = data;
    const isWorkInWeekdays = Boolean(Number(schedule.weekdays.is_active));
    const isWorkInWeekends = Boolean(Number(schedule.weekends.is_active));
    const isWorkInHolidays = Boolean(Number(schedule.holidays.is_active));

    return (
      <>
        <Typography variant="h4" color="textPrimary" component="h4" className={s.title}>
          График работы
        </Typography>
        <div>
          {isWorkInWeekdays && (
            <Typography variant="body1" color="textPrimary">
              Будни - <span className={s.workHours}>{`с ${schedule.weekdays.from} до ${schedule.weekdays.to}`}</span>
            </Typography>
          )}
          {isWorkInWeekends && (
            <Typography variant="body1" color="textPrimary">
              Выходные - <span className={s.workHours}>{`с ${schedule.weekends.from} до ${schedule.weekends.to}`}</span>
            </Typography>
          )}
          {isWorkInHolidays && (
            <Typography variant="body1" color="textPrimary">
              Праздники -{' '}
              <span className={s.workHours}>{`с ${schedule.holidays.from} до ${schedule.holidays.to}`}</span>
            </Typography>
          )}
        </div>
      </>
    );
  };

  const renderWorkTypes = () => {
    const { service_work_types } = data;

    return (
      <>
        <Typography variant="h4" color="textPrimary" component="h4" className={s.title}>
          Виды работ
        </Typography>

        <div>
          {service_work_types.map((workType: WorkType) => (
            <div key={workType.id} className={s.workType}>
              <Typography variant="body1" color="textPrimary" component="div" className={s.workTypeName}>
                {workType.name}
              </Typography>
              <div className={s.separator} />
            </div>
          ))}
        </div>
      </>
    );
  };

  const renderAmenities = () => {
    const availableAmenityIds = Object.keys(data.comfort).filter((key) => Boolean(data.comfort[key]));

    return (
      <>
        <Typography variant="h4" color="textPrimary" component="h4" className={s.title}>
          Доступные удобства
        </Typography>
        <Typography variant="body1" color="textPrimary" component="div" className={s.list}>
          {availableAmenityIds.map((amenityId: string) => {
            const amenity = DEFAULT_AMENITIES[amenityId];
            const size = amenityId === 'pay_card' ? 48 : 24;

            return (
              <div className={cx(s.amenity, s.listItem)}>
                <div className={s.iconContainer}>
                  <Icon
                    className={s.icon}
                    width="1.2rem"
                    height="1.2rem"
                    component={amenity.icon}
                    viewBox={`0 0 ${size} ${size}`}
                  />
                </div>
                <Typography variant="body2" color="textPrimary" component="span">
                  {amenity.title}
                </Typography>
              </div>
            );
          })}
        </Typography>
      </>
    );
  };

  const renderMedia = () => {
    return (
      <div className={s.section}>
        <Typography variant="h4" color="textPrimary" component="h4" className={s.title}>
          Видео и фотоматериалы
        </Typography>
        <div>
          <ServiceSlider slides={slides} />
        </div>
      </div>
    );
  };

  const renderPage = () => {
    return (
      <ContainerWrapper bgcolor="grey.100">
        <div className={s.root}>
          <div className={s.header}>
            <div className={s.headerContent}>
              <Typography variant="h4" color="textPrimary" component="div" gutterBottom>
                {data.name}
              </Typography>
              <div className={s.rating}>
                <Rating name="read-only" value={data.service_classification.stars} size="medium" readOnly />
              </div>
            </div>
            <Link href="/service">
              <Button variant="contained" color="primary" size="large">
                Оставить заявку
              </Button>
            </Link>
          </div>

          {isReviewsSuccess && (
            <div className={s.userReview}>
              <UserReview rating={data.rating} reviewCount={data.count_review} />
            </div>
          )}
          <div className={s.address}>
            <div className={s.listItem}>
              <div className={s.iconContainer}>
                <LocationIcon width="1.2rem" height="1.2rem" />
              </div>
              <Typography variant="body2" color="textPrimary" component="span">
                {data.contacts.address}
              </Typography>
            </div>
          </div>

          <div>
            {slides.length !== 0 && renderMedia()}

            <div className={s.section}>
              <Typography variant="h4" color="textPrimary" component="h4" className={s.title}>
                Об автосервисе
              </Typography>
              <Typography variant="body1" color="textPrimary">
                {data.contacts.description}
              </Typography>
            </div>

            <div className={s.section}>
              <Typography variant="h4" color="textPrimary" component="h4" className={s.title}>
                Специализация
              </Typography>
              <Typography variant="body1" color="textPrimary" component="div">
                {data.service_auto.map((auto: any) => (
                  <span className={s.tag} key={auto.mark_id}>
                    {auto.mark_name}
                  </span>
                ))}
              </Typography>
            </div>

            <div className={s.section}>{renderWorkTypes()}</div>

            <div className={s.section}>{renderSchedule()}</div>

            <div className={s.section}>{renderAmenities()}</div>

            <div className={s.section}>
              <Reviews reviews={reviews} titleTypographyProps={{ variant: 'h4' }} />
            </div>
          </div>
        </div>
      </ContainerWrapper>
    );
  };

  return <Wrapper loading={isLoading}>{isSuccess && renderPage()}</Wrapper>;
};
