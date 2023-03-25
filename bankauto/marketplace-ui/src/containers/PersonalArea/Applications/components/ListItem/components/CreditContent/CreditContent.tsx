import { ReactComponent as IconPercentRed } from 'icons/PercentRed.svg';
import React, { FC, useMemo } from 'react';
import { Box, Button, Divider, PriceFormat, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { Link } from 'components';
import { useCreditChipsData } from 'containers/PersonalArea/hooks/useCreditChipData';
import {
  APPLICATION_CREDIT_STATUS,
  APPLICATION_SIMPLE_CREDIT_STEP,
  CreditSubtype,
  SimpleCreditApplicationShort,
  SimpleCreditSubtype,
} from '@marketplace/ui-kit/types';
import { formatFromTimestamp } from 'helpers';
import { calculateMonthlyPayment } from 'helpers/credit';

import { useStyles } from '../../ListItem.styles';
import { DataCredit } from '../DataCredit';

interface Props {
  application: SimpleCreditApplicationShort;
}

const CreditContent: FC<Props> = ({ application }) => {
  const { subtype, amount, term, rate, vehicleCost, initialPayment, status, lastSentStep } = application.simpleCredit!;

  const monthlyPayment = useMemo(() => {
    return calculateMonthlyPayment(amount, term, rate);
  }, [amount, term, rate, calculateMonthlyPayment]);

  const { createdAt } = application;
  const { vehicleImage, rightBlock, iconPercentRed } = useStyles();
  const { isMobile } = useBreakpoints();

  const getTitles = useMemo(() => {
    switch (subtype) {
      case SimpleCreditSubtype.JUST_MONEY:
        return { title: 'Кредит наличными', mobileTitle: 'наличными' };
      case SimpleCreditSubtype.VEHICLE_NEW:
        return { title: 'Кредит на автомобиль', mobileTitle: 'на автомобиль' };
      case CreditSubtype.BDA_C2C:
      case SimpleCreditSubtype.VEHICLE_USED_C2C:
        return { title: 'Кредит на автомобиль с пробегом', mobileTitle: 'на автомобиль с пробегом' };
      default:
        return { title: '', mobileTitle: '' };
    }
  }, [subtype]);

  const { title, mobileTitle } = getTitles;

  const creditChip = useCreditChipsData(status, lastSentStep);
  const detailLink = `/profile/simple-credit/${application.uuid}`;

  const canContinueFilling = useMemo(() => {
    return (
      (status === APPLICATION_CREDIT_STATUS.DRAFT || status === APPLICATION_CREDIT_STATUS.FROZEN) &&
      lastSentStep !== APPLICATION_SIMPLE_CREDIT_STEP.EMPLOYMENT
    );
  }, [status, lastSentStep]);

  return (
    <>
      {!isMobile ? (
        <>
          <Box display="flex" flexWrap="nowrap" alignItems="stretch" m={3.75} mr={0}>
            <Box mr={4.75} className={vehicleImage}>
              <IconPercentRed className={iconPercentRed} width="6rem" height="6rem" />
            </Box>
            <Box display="flex" flexDirection="column" justifyContent="space-between">
              <DataCredit
                title={title}
                subTitle={formatFromTimestamp(createdAt, 'dd.MM.yyyy')}
                creditAmount={amount}
                creditTerm={term}
                monthlyPayment={monthlyPayment}
                rate={rate}
                chips={creditChip}
              />

              {canContinueFilling && (
                <Box width="22.75rem" minWidth="22.75rem" maxWidth="100%" pt={2.5}>
                  <Link href={detailLink} color="inherit" style={{ display: 'block' }}>
                    <Button variant="contained" color="primary" size="medium" fullWidth>
                      <Typography variant="subtitle1" component="span" style={{ fontWeight: 'bold' }}>
                        Продолжить заполнение
                      </Typography>
                    </Button>
                  </Link>
                </Box>
              )}
              {status === APPLICATION_CREDIT_STATUS.APPROVED && (
                <Box pt={2.5}>
                  <Typography variant="h5">
                    С вами свяжется менеджер для назначения встречи в отделении банка
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
          {subtype !== SimpleCreditSubtype.JUST_MONEY && (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              p={3.75}
              className={rightBlock}
            >
              <Box mb={2.5}>
                <Typography variant="h5" component="h5" align="center">
                  Стоимость автомобиля
                </Typography>
                <Typography variant="h3" component="h3" align="center">
                  <PriceFormat value={vehicleCost} suffix=" ₽" />
                </Typography>
              </Box>
              <Box>
                <Typography variant="h5" component="h5" align="center">
                  Первоначальный взнос
                </Typography>
                <Typography variant="h3" component="h3" align="center">
                  <PriceFormat value={initialPayment} suffix=" ₽" />
                </Typography>
              </Box>
            </Box>
          )}
        </>
      ) : (
        <>
          <Box display="flex" flexWrap="nowrap" alignItems="center" pb={2.5}>
            <Box mr={2.25} className={vehicleImage}>
              <IconPercentRed className={iconPercentRed} width="1.875rem" height="1.875rem" />
            </Box>
            <Box display="flex" flexDirection="column" justifyContent="space-between">
              <Typography variant="h5" component="h3">
                Кредит
              </Typography>
              <Typography variant="h3">{mobileTitle}</Typography>
            </Box>
          </Box>
          <Divider />

          <DataCredit
            title={title}
            subTitle={formatFromTimestamp(createdAt, 'dd.MM.yyyy')}
            creditAmount={amount}
            creditTerm={term}
            monthlyPayment={monthlyPayment}
            rate={rate}
            chips={creditChip}
          />
          <Box>
            <Divider />
            {subtype !== SimpleCreditSubtype.JUST_MONEY && (
              <Box my="1.25rem">
                <Typography variant="subtitle2" component="h6">
                  Стоимость автомобиля
                </Typography>
                <Typography variant="h5" component="h5">
                  <PriceFormat value={vehicleCost} suffix=" ₽" />
                </Typography>
              </Box>
            )}
            <Box my="1.25rem">
              <Typography variant="subtitle2" component="h6">
                Первоначальный взнос
              </Typography>
              <Typography variant="h5" component="h6">
                <PriceFormat value={initialPayment} suffix=" ₽" />
              </Typography>
            </Box>
          </Box>
          {canContinueFilling && (
            <Link href={detailLink} color="inherit" style={{ display: 'block' }}>
              <Button variant="contained" color="primary" size="medium" fullWidth>
                <Typography variant="subtitle1" component="span">
                  Продолжить заполнение
                </Typography>
              </Button>
            </Link>
          )}
          {status === APPLICATION_CREDIT_STATUS.APPROVED && (
            <Box pt={2.5}>
              <Typography variant="h5">С вами свяжется менеджер для назначения встречи в отделении банка</Typography>
            </Box>
          )}
        </>
      )}
    </>
  );
};

export { CreditContent };
