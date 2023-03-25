import React, { FC, useMemo } from 'react';
import { Paper, Grid, Divider } from '@marketplace/ui-kit';
import { APPLICATION_INSURANCE_TYPE } from '@marketplace/ui-kit/types';
import { useSelector } from 'react-redux';
import { StateModel } from 'store/types';
import { INSURANCE_PAYMENT } from 'types/Insurance';
import { useRouter } from 'next/router';
import { useStyles } from './InsuranceBuyBlock.styles';
import { InsuranceItem } from './components';

interface Props {}

const InsuranceBuyBlock: FC<Props> = () => {
  const s = useStyles();
  const casco = useSelector(
    ({
      insuranceApplication: {
        application: { insurance },
      },
    }: StateModel) => (insurance || []).find(({ type }) => type === APPLICATION_INSURANCE_TYPE.CASCO),
  );
  const osago = useSelector(
    ({
      insuranceApplication: {
        application: { insurance },
      },
    }: StateModel) => (insurance || []).find(({ type }) => type === APPLICATION_INSURANCE_TYPE.OSAGO),
  );
  const services = useSelector((state: StateModel) => state.insuranceApplication.services);
  const { query } = useRouter();
  const osagoPaid = useMemo(
    () => query.payment === INSURANCE_PAYMENT.SUCCESS && query.type === APPLICATION_INSURANCE_TYPE.OSAGO,
    [query],
  );
  const cascoPaid = useMemo(
    () => query.payment === INSURANCE_PAYMENT.SUCCESS && query.type === APPLICATION_INSURANCE_TYPE.CASCO,
    [query],
  );

  return (
    <Paper>
      <Grid container direction="column">
        {/* <Grid item xs className={s.block}> */}
        {/*  <Icon component={LogoRenis} viewBox="0 0 375 30" className={s.renisLogo} /> */}
        {/* </Grid> */}
        {(casco as any) ? (
          <>
            <Grid item xs>
              <Divider />
            </Grid>
            <Grid item xs className={s.block}>
              <InsuranceItem
                type={APPLICATION_INSURANCE_TYPE.CASCO}
                cost={casco?.price}
                paymentLink={services.kasko.paymentLink}
                paid={cascoPaid}
              />
            </Grid>
          </>
        ) : null}
        {(osago as any) ? (
          <>
            <Grid item xs>
              <Divider />
            </Grid>
            <Grid item xs className={s.block}>
              <InsuranceItem
                type={APPLICATION_INSURANCE_TYPE.OSAGO}
                cost={osago?.price}
                paymentLink={services.osago.paymentLink}
                paid={osagoPaid}
              />
            </Grid>
          </>
        ) : null}
      </Grid>
    </Paper>
  );
};

export { InsuranceBuyBlock };
