import React, { FC } from 'react';
import NumberFormat from 'react-number-format';
import { Button, Box, Img, Typography, PriceFormat, Divider, useBreakpoints } from '@marketplace/ui-kit';
import { APPLICATION_TYPE, VehicleApplicationShort, VEHICLE_TYPE } from '@marketplace/ui-kit/types';
import { Link } from 'components';
import { useCalculatedSales } from 'containers/PersonalArea/hooks/useIsCalculatedSales';
import { checkIsApplicationReadOnly } from 'containers/PersonalArea/Application/helpers/checkIsApplicationReadOnly';
import { deactivatedStatusesForApplications } from 'constants/application';
import { useCreateVehicleChipsData } from '../../../../../hooks/useCreateChipsData';
import { useVehicleChipsData } from '../../../../../hooks/useVehicleChipData';
import { PartnerShort } from '../../../../../components';
import { useStyles } from '../../ListItem.styles';
import { Data, DataMobile } from '../Data';
import { DealInfo } from '../DealInfo';

interface Props {
  application: VehicleApplicationShort;
}

const VehicleContent: FC<Props> = ({ application }) => {
  const { credit, tradeIn, vehicleData, uuid: orderId, id: applicationId } = application;
  const vehicle = application.vehicle!;
  const { vehicleImage, rightBlock } = useStyles();
  const { isMobile } = useBreakpoints();
  const { isCalculatedCredit, isCalculatedTradeIn, isActiveOrder } = useCalculatedSales({
    vehicleStatus: vehicle.status,
    creditStatus: credit?.status,
    tradeInStatus: tradeIn?.status,
  });

  const title = vehicle.type === VEHICLE_TYPE.NEW ? 'Новый автомобиль' : 'Автомобиль с пробегом';

  const {
    brand,
    body,
    color,
    drive,
    photos,
    engine: { engine, enginePower, engineVolume },
    equipment,
    company,
    generation,
    model,
    transmission,
    year,
    vin,
    mileage,
    status: vehicleDataStatus,
  } = vehicleData!;

  const image = photos.length === 0 ? '/images/DEFAULT_IMAGE_REPLACER.jpg' : photos[0][750];
  const equipmentActual =
    vehicle.type === VEHICLE_TYPE.NEW ? (
      equipment
    ) : (
      <>
        <NumberFormat value={mileage} thousandSeparator={' '} displayType="text" /> км.
      </>
    );
  const subTitle = `Заявка № ${applicationId}`;
  const vehicleName = `${brand.name} ${model.name} ${generation.name} ${
    vehicle.type === VEHICLE_TYPE.NEW ? equipment : ''
  }`;
  const vinData = `${vin} • ${year} год`;
  const isVehicleDeactivated = deactivatedStatusesForApplications.includes(vehicleDataStatus);
  const orderLink = isVehicleDeactivated ? '/car/new/' : `/profile/applications/${orderId}`;
  const buttonText =
    (!isVehicleDeactivated && (checkIsApplicationReadOnly(vehicle.status) ? 'Просмотр' : 'Продолжить бронирование')) ||
    'Выбрать другой автомобиль';

  const mainVehicleData = [
    equipmentActual,
    color.name,
    body,
    transmission,
    drive,
    engine,
    `${engineVolume} л.`,
    `${enginePower} л.c.`,
  ].reduce(
    (accumulator, item, index) => (
      <>
        {accumulator}
        {index !== 0 ? ' • ' : ''}
        {item}
      </>
    ),
    '',
  );

  const tradeInDiscount = (isCalculatedTradeIn && tradeIn?.discount) || 0;
  const creditDiscount = (isCalculatedCredit && credit?.discount) || 0;
  const price = vehicle.price - creditDiscount - (vehicle.discount || 0) - tradeInDiscount;
  const vehicleNotAvailableChips = useVehicleChipsData({ vehicleStatus: vehicleDataStatus });
  const vehicleAvailableChips = useCreateVehicleChipsData(vehicle.meetingSchedule, vehicle.status);

  return (
    <>
      {!isMobile ? (
        <>
          <Box display="flex" flexWrap="nowrap" alignItems="stretch" m={3.75} mr={0}>
            <Box mr={4.75} className={vehicleImage}>
              <Img src={image} alt={title} aspect="5/3" />
            </Box>
            <Box display="flex" flexDirection="column" justifyContent="space-between">
              <Data
                title={title}
                subTitle={subTitle}
                vehicleName={vehicleName}
                chips={isVehicleDeactivated ? vehicleNotAvailableChips : vehicleAvailableChips}
                vehicleData={mainVehicleData}
                vin={vinData}
              />
              <Box width="22.75rem" maxWidth="100%" pt={2.5}>
                <Link href={orderLink} color="inherit" style={{ display: 'block' }}>
                  <Button variant="contained" color="primary" size="large" fullWidth>
                    <Typography variant="subtitle1" component="span" style={{ fontWeight: 'bold' }}>
                      {buttonText}
                    </Typography>
                  </Button>
                </Link>
              </Box>
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            alignItems="center"
            p={3.75}
            className={rightBlock}
          >
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography variant="h3" component="span" align="right">
                <PriceFormat value={price} />
              </Typography>
              {isActiveOrder && (
                <DealInfo
                  applicationType={APPLICATION_TYPE.VEHICLE}
                  creditStatus={credit?.status}
                  tradeInStatus={tradeIn?.status}
                />
              )}
            </Box>
            {company && (
              <PartnerShort
                companyName={company?.name}
                companyAddress={company?.officeAddress}
                brand={brand.name}
                type={vehicle.type}
                status={vehicle.status}
              />
            )}
          </Box>
        </>
      ) : (
        <>
          <Box display="flex" flexWrap="nowrap" alignItems="center" pb={2.5}>
            <Box mr={2.25} className={vehicleImage}>
              <Img src={image} alt={title} contain />
            </Box>
            <Box display="flex" flexDirection="column" justifyContent="space-between">
              <Typography variant="subtitle1" component="h3" style={{ fontWeight: 'bold' }}>
                {title}
              </Typography>
              <Typography variant="h3" component="span">
                <PriceFormat value={price} />
              </Typography>
            </Box>
          </Box>
          <Divider />
          <Box py={1.25}>
            <Typography variant="body2" color="secondary" style={{ fontWeight: 'bold' }}>
              {subTitle}
            </Typography>
          </Box>
          <DataMobile
            vehicleName={vehicleName}
            chips={isVehicleDeactivated ? vehicleNotAvailableChips : vehicleAvailableChips}
            vehicleData={mainVehicleData}
            vin={vinData}
          />
          {isActiveOrder && (
            <DealInfo
              applicationType={APPLICATION_TYPE.VEHICLE}
              creditStatus={credit?.status}
              tradeInStatus={tradeIn?.status}
            />
          )}
          <Box py={2.5}>
            <Divider />
          </Box>
          {company && (
            <PartnerShort
              companyName={company?.name}
              companyAddress={company?.officeAddress}
              brand={brand.name}
              type={vehicle.type}
              status={vehicle.status}
            />
          )}
          <Box py={2.5}>
            <Divider />
          </Box>
          <Link href={orderLink} color="inherit" style={{ display: 'block' }}>
            <Button variant="contained" color="primary" size="large" fullWidth>
              <Typography variant="subtitle1" component="span" style={{ fontWeight: 'bold' }}>
                {buttonText}
              </Typography>
            </Button>
          </Link>
        </>
      )}
    </>
  );
};

export { VehicleContent };
