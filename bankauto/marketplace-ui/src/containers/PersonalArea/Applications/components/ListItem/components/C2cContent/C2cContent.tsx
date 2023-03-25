import React, { FC } from 'react';
import NumberFormat from 'react-number-format';
import { Button, Box, Img, Typography, PriceFormat, Divider, useBreakpoints } from '@marketplace/ui-kit';
import { APPLICATION_CREDIT_STATUS, APPLICATION_TYPE, C2cApplicationShort } from '@marketplace/ui-kit/types';
import { Link } from 'components';
import { useC2cChips } from 'containers/PersonalArea/hooks/useC2cChips';
import { withoutCode } from 'helpers/phone';
import { useStyles } from '../../ListItem.styles';
import { Data, DataMobile } from '../Data';
import { DealInfo } from '../DealInfo';
import { ContactPerson } from '../ContactPerson';

interface Props {
  application: C2cApplicationShort;
}

const C2cContent: FC<Props> = ({ application }) => {
  const {
    vehicleData,
    uuid: orderId,
    id: applicationId,
    c2c: { seller },
  } = application;
  const credit = application.credit!;
  const c2c = application.c2c!;
  const { vehicleImage, rightBlock } = useStyles();
  const { isMobile } = useBreakpoints();
  const isActiveOrder = true;
  const title = 'Автомобиль от частного лица';
  const chips = useC2cChips(credit.status);

  const {
    brand,
    body,
    color,
    drive,
    photos,
    engine: { engine, enginePower, engineVolume },
    generation,
    model,
    transmission,
    year,
    vin,
    mileage,
  } = vehicleData!;

  const image = photos.length === 0 ? '/images/DEFAULT_IMAGE_REPLACER.jpg' : photos[0][750];

  const equipmentActual = (
    <>
      <NumberFormat value={mileage} thousandSeparator={' '} displayType="text" /> км.
    </>
  );
  const subTitle = `Заявка № ${applicationId}`;
  const vehicleName = `${brand.name} ${model.name} ${generation.name}`;
  const vinData = `${vin} • ${year} год`;
  const orderLink = `/profile/c2c-credit/${orderId}`;
  const buttonText =
    credit.status === APPLICATION_CREDIT_STATUS.CREATED || credit.status === APPLICATION_CREDIT_STATUS.DRAFT
      ? 'Продолжить заполнение'
      : 'Просмотр';
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
                chips={chips}
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
                <PriceFormat value={c2c.price} suffix=" ₽" />
              </Typography>
              {isActiveOrder && <DealInfo applicationType={APPLICATION_TYPE.C2C} creditStatus={credit.status} />}
            </Box>
            {seller && (
              <Box textAlign="center">
                <ContactPerson
                  name={[seller.lastName, seller.firstName, seller.patronymic].filter((v) => !!v).join(' ')}
                  phone={+withoutCode(seller.phone)}
                />
              </Box>
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
          <DataMobile vehicleName={vehicleName} chips={chips} vehicleData={mainVehicleData} vin={vinData} />
          <Box py={2.5}>
            <Divider />
          </Box>
          <Typography variant="h3" component="span">
            <PriceFormat value={c2c.price} suffix=" ₽" />
          </Typography>
          {isActiveOrder && <DealInfo applicationType={APPLICATION_TYPE.C2C} creditStatus={credit.status} />}
          <Box py={2.5}>
            <Divider />
          </Box>
          {seller && (
            <>
              <Box textAlign="center">
                <ContactPerson
                  name={[seller.lastName, seller.firstName, seller.patronymic].filter((v) => !!v).join(' ')}
                  phone={+withoutCode(seller.phone)}
                />
              </Box>
              <Box py={2.5}>
                <Divider />
              </Box>
            </>
          )}
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

export { C2cContent };
