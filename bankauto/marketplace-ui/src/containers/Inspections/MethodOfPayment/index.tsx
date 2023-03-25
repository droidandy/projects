import React, { FC } from 'react';
import { Typography } from '@marketplace/ui-kit';
import { IconPaymentLogos } from 'icons/inspections';

export const MethodOfPayment: FC = () => (
  <>
    <Typography variant="h4" component="p" style={{ paddingBottom: '0.9375rem' }}>
      Способы оплаты:
    </Typography>
    <IconPaymentLogos width="22.8125rem" height="2.1875rem" viewBox="0 0 365 35" />
  </>
);
