import React, { FC } from 'react';
import NumberFormat from 'react-number-format';
import { Box, Button, Divider, Img, pluralize, PriceFormat, Typography, useBreakpoints } from '@marketplace/ui-kit';
import {
  APPLICATION_CREDIT_STATUS,
  APPLICATION_INSTALMENT_STATUS,
  APPLICATION_TYPE,
  InstalmentApplicationShort,
  VEHICLE_TYPE,
} from '@marketplace/ui-kit/types';
import { Link } from 'components';
import { deactivatedStatusesForApplications } from 'constants/application';
import { useCreateInstalmentChipsData } from 'containers/PersonalArea/hooks/useCreateChipsData';
import { useVehicleChipsData } from 'containers/PersonalArea/hooks/useVehicleChipData';
import { PartnerShort } from '../../../../../components';
import { useStyles } from '../../ListItem.styles';
import { Data, DataMobile } from '../Data';
import { DealInfo } from '../DealInfo';

interface Props {
  application: InstalmentApplicationShort;
}

const InstalmentContent: FC<Props> = ({ application }) => {
  const { vehicleData, uuid: orderId, id: applicationId } = application;
  const instalment = application.instalment!;
  const credit = application.credit!;
  const { vehicleImage, rightBlock } = useStyles();
  const { isMobile } = useBreakpoints();
  const isActiveOrder = instalment.status !== APPLICATION_INSTALMENT_STATUS.EXPIRED;
  const title = 'Автомобиль в рассрочку';

  const {
    brand,
    body,
    color,
    drive,
    photos,
    engine: { engine, enginePower, engineVolume },
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

  const equipmentActual = (
    <>
      <NumberFormat value={mileage} thousandSeparator={' '} displayType="text" /> км.
    </>
  );
  const subTitle = `Заявка № ${applicationId}`;
  const vehicleName = `${brand.name} ${model.name} ${generation.name}`;
  const initialPaymentText = `Первоначальный взнос ${instalment.initialPayment}%`;
  const termText = `на ${instalment.months} месяц${pluralize(instalment.months, ['', 'а', 'ев'])}`;
  const vinData = `${vin} • ${year} год`;
  const isVehicleDeactivated = deactivatedStatusesForApplications.includes(vehicleDataStatus);
  const orderLink = isVehicleDeactivated ? '/installment/vehicles/' : `/profile/installment/${orderId}`;

  const buttonText =
    (isVehicleDeactivated && 'Выбрать другой автомобиль') ||
    (credit.status === APPLICATION_CREDIT_STATUS.CREATED &&
      instalment.status !== APPLICATION_INSTALMENT_STATUS.CANCEL &&
      'Продолжить бронирование') ||
    'Открыть заявку';

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
  const vehicleAvailableChips = useCreateInstalmentChipsData(
    instalment.status,
    credit.status,
    instalment.meetingSchedule,
    application.credit?.lastSentStep,
  );
  const vehicleNotAvailableChips = useVehicleChipsData({ vehicleStatus: vehicleDataStatus });

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
              <Typography variant="h5" component="span">
                {initialPaymentText}
              </Typography>
              <Typography variant="h3" component="span" align="right">
                <PriceFormat value={instalment.payment} suffix=" ₽/месяц" />
              </Typography>
              <Typography variant="h5" component="span">
                {termText}
              </Typography>
              {isActiveOrder && (
                <DealInfo
                  applicationType={APPLICATION_TYPE.INSTALMENT}
                  instalmentStatus={instalment.status}
                  creditStatus={credit.status}
                />
              )}
            </Box>
            {company && (
              <PartnerShort
                companyName={company?.name}
                companyAddress={company?.officeAddress}
                brand={brand.name}
                type={VEHICLE_TYPE.USED}
                status={credit.status}
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
          <Box py={2.5}>
            <Divider />
          </Box>
          <Typography variant="h6" component="span">
            {initialPaymentText}
          </Typography>
          <Typography variant="h3" component="span">
            <PriceFormat value={instalment.payment} suffix=" ₽/месяц" />
          </Typography>
          <Typography variant="h6" component="span">
            {termText}
          </Typography>
          {isActiveOrder && (
            <DealInfo
              applicationType={APPLICATION_TYPE.INSTALMENT}
              instalmentStatus={instalment.status}
              creditStatus={credit.status}
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
              type={VEHICLE_TYPE.USED}
              status={credit.status}
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

export { InstalmentContent };
