import React, { FC, useMemo } from 'react';
import { ReactComponent as CarIcon } from '@marketplace/ui-kit/icons/icon-car.svg';
import { ReactComponent as EngineIcon } from '@marketplace/ui-kit/icons/icon-engine.svg';
import { ReactComponent as DriveIcon } from '@marketplace/ui-kit/icons/icon-drive.svg';
import { ReactComponent as TransmissionIcon } from '@marketplace/ui-kit/icons/icon-transmission.svg';
import { Grid, Icon, PriceFormat, useBreakpoints } from '@marketplace/ui-kit';
import { useApplication } from 'store/profile/application/hook';
import { ReactComponent as CalendarIcon } from 'icons/iconCalendarBlank.svg';
import { ReactComponent as HashIcon } from 'icons/iconHash.svg';
import { Collapse, DefaultCollapseHeader } from 'components/Collapse';
import { MainSubtitleProps } from 'components/Collapse/DefaultCollapseHeader/components';
import { Color } from 'constants/Color';
import { VEHICLE_SCENARIO, VEHICLE_TYPE } from '@marketplace/ui-kit/types';
import { PtsIcon, UsersIcon } from 'icons/vehicleInfoIcons';
import { VehicleInfoItem } from './components';
import { useStyles } from './VehicleContainer.styles';

interface Props {
  isBookingCanceled: boolean;
  tooltipText?: string;
  title?: string;
  subtitle?: MainSubtitleProps;
}

export const VehicleContainer: FC<Props> = ({
  isBookingCanceled = false,
  tooltipText,
  title = 'Ваш автомобиль',
  subtitle,
}) => {
  const { vehicle } = useApplication();
  const isNew = vehicle?.data?.type === VEHICLE_TYPE.NEW;
  const isC2C =
    vehicle?.data?.scenario &&
    [VEHICLE_SCENARIO.USED_AUCTION_AND_CLIENT, VEHICLE_SCENARIO.USED_FROM_CLIENT].includes(
      `${vehicle.data.scenario}` as VEHICLE_SCENARIO,
    );
  const vehicleInfoData = useMemo(() => {
    if (!vehicle?.data) return null;

    const {
      vin,
      productionYear,
      bodyType,
      engine,
      equipment: { volume, power },
      drive,
      transmission,
      color,
      pts,
      ownersNumber,
    } = vehicle.data;

    const vehicleInfo = [
      { name: 'VIN', value: vin, icon: HashIcon },
      { name: 'Год', value: productionYear, icon: CalendarIcon },
      { name: 'Кузов', value: bodyType.name, icon: CarIcon },
      {
        name: 'Двигатель',
        value: `${volume}л/ ${power}л.с /${engine.name}`,
        icon: EngineIcon,
      },
      { name: 'Привод', value: drive.name, icon: DriveIcon },
      { name: 'Коробка', value: transmission.name, icon: TransmissionIcon },
      { name: 'Цвет', value: color.name, code: color.code },
    ];
    if (!isNew) {
      vehicleInfo.push(
        { name: 'Количество владельцев', value: ownersNumber || 1, icon: UsersIcon },
        { name: 'ПТС', value: pts || 'Оригинал', icon: PtsIcon },
      );
    }
    return vehicleInfo;
  }, [isNew, vehicle.data]);

  const s = useStyles();
  const { isMobile } = useBreakpoints();

  if (!vehicle?.data) return null;

  const { discounts } = vehicle.data!;

  const header = () => (
    <DefaultCollapseHeader
      digit={{ value: 1, circleColor: isBookingCanceled ? Color.GRAY : Color.GREEN }}
      status={vehicle.status}
      main={{
        title,
        tooltipText,
        subtitle: {
          value: isBookingCanceled ? 'Бронирование отменено' : 'Забронирован',
          color: isBookingCanceled ? Color.BLACK : Color.GREEN,
          ...subtitle,
        },
      }}
      additional={{
        title: discounts.market ? (
          <>
            Скидка от дилера <PriceFormat value={discounts.market} />
          </>
        ) : null,
      }}
    />
  );

  return (
    <Collapse header={header} expandIconClassName={s.expandIcon}>
      {() => (
        <Grid container>
          {vehicleInfoData?.map(
            ({ name, value, icon, code }) =>
              value && (
                <Grid item xs={isMobile ? 12 : ((!isNew || isC2C) && 4) || (name === 'Цвет' && 12) || 4} key={name}>
                  <VehicleInfoItem name={name} value={value} key={name}>
                    {name === 'Цвет' ? (
                      <span className={s.colorCircle} style={{ backgroundColor: code }} />
                    ) : (
                      <Icon viewBox="0 0 40 40" component={icon} className={s.icon} />
                    )}
                  </VehicleInfoItem>
                </Grid>
              ),
          )}
        </Grid>
      )}
    </Collapse>
  );
};
