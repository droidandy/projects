import React, { FC } from 'react';
import { ContainerWrapper, Typography, useBreakpoints, Box } from '@marketplace/ui-kit';
import cx from 'classnames';
import { useDebitSubmit } from 'store';
import { LeadFormData } from 'types/LeadFormData';
import { LeadForm } from 'containers/Finance/components';
import { useRouter } from 'next/router';
import { DebitCardName, FilterKey } from 'store/types';
import { useStyles } from './DataSubmit.styles';

interface Props {
  className?: string;
  title: string;
  subtitle?: string;
}
type Query = Partial<Record<FilterKey, 'true' | 'false'> & { debitCardName: DebitCardName }>;
type DebitCardData = Partial<Record<FilterKey, boolean> & { debitCardName: DebitCardName }>;

const DataSubmit: FC<Props> = ({ className, title = 'Закажите карту РГС\u00A0Банка', subtitle }) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();

  const router = useRouter();

  const { loading, submitDebit } = useDebitSubmit();

  const handleFormSubmit = (data: LeadFormData) => {
    const query = router.query as Query;
    const debitCardData: DebitCardData = Object.entries(query).reduce((obj, [key, value]) => {
      const mappedValue = value === 'true' ? true : value === 'false' ? false : value;
      return { ...obj, [key]: mappedValue };
    }, {});
    submitDebit(data, debitCardData);
  };

  return (
    <ContainerWrapper className={cx(s.root, className)}>
      <Box mb={isMobile ? 1.25 : 2.5}>
        <Typography component="h2" variant={isMobile ? 'h4' : 'h2'} align="center">
          {title}
        </Typography>
      </Box>
      <Box mb={isMobile ? 2.5 : 3.75}>
        <Typography component="h3" variant={isMobile ? 'h5' : 'h4'} align="center">
          {subtitle}
        </Typography>
      </Box>
      <LeadForm loading={loading} onSubmit={handleFormSubmit} />
    </ContainerWrapper>
  );
};

export { DataSubmit };
