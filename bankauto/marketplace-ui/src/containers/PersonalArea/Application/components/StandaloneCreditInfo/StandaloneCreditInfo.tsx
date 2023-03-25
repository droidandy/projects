import React, { FC } from 'react';
import { Collapse, DefaultCollapseHeader } from 'components/Collapse';
import { Box, Grid, PriceFormat, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { SimpleCreditSubtype } from '@marketplace/ui-kit/types';
import { DataCredit } from 'containers/PersonalArea/Applications/components/ListItem/components/DataCredit';
import { SimpleCreditState } from 'store/types';
import { SimpleCreditStep } from 'containers/Finance/Credit/types/CreditFormTypes';
import { useRouter } from 'next/router';
import { useStyles } from './StandaloneCreditInfo.styles';
import { getStatuses } from './helpers/getStatuses';

interface Props {
  simpleCredit: SimpleCreditState;
  creditStep: SimpleCreditStep;
  handleCancelCredit: (callback: () => void) => void;
}

const StandaloneCreditInfo: FC<Props> = ({ simpleCredit, creditStep, handleCancelCredit }) => {
  const { status, amount, term, monthlyPayment, rate, vehicleCost, initialPayment, subtype } = simpleCredit;
  const { isMobile } = useBreakpoints();
  const { statusText, statusTextColor, tooltipText } = getStatuses(status);
  const router = useRouter();

  const additionalCollapse =
    creditStep === SimpleCreditStep.Additional || creditStep === SimpleCreditStep.Employment
      ? undefined
      : {
          title: <></>,
          subtitle: {
            value: 'Отменить кредит',
            onClick: () => {
              handleCancelCredit(() => router.push('/profile/applications'));
            },
          },
        };

  const s = useStyles();

  const header = () => (
    <DefaultCollapseHeader
      main={{
        title: 'Оформление заявки на кредит',
        subtitle: {
          value: statusText,
          color: statusTextColor,
        },
        tooltipText,
      }}
      additional={additionalCollapse}
    />
  );

  return (
    <>
      <Box>
        <Collapse header={header} expanded>
          {() => (
            <Grid container>
              <Grid item sm={8}>
                <DataCredit
                  creditAmount={amount}
                  creditTerm={term}
                  monthlyPayment={monthlyPayment}
                  rate={rate}
                  bigMargin
                />
              </Grid>
              {subtype !== SimpleCreditSubtype.JUST_MONEY && (
                <Grid item sm={4} className={s.rightBlock}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    p={isMobile ? '0.625rem 0 0' : '0 0.625rem 0 0'}
                  >
                    <Box mb={5}>
                      <Typography variant="h5" component="h5" align="center">
                        Стоимость автомобиля
                      </Typography>
                      <Typography variant={isMobile ? 'h5' : 'h4'} component="h3" align="center">
                        <PriceFormat value={vehicleCost} suffix=" ₽" />
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="h5" component="h5" align="center">
                        Первоначальный взнос
                      </Typography>
                      <Typography variant={isMobile ? 'h5' : 'h4'} component="h3" align="center">
                        <PriceFormat value={initialPayment} suffix=" ₽" />
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </Collapse>
      </Box>
    </>
  );
};

export { StandaloneCreditInfo };
