import React, { FC } from 'react';
import { ContainerWrapper, Typography, useBreakpoints, Box } from '@marketplace/ui-kit';
import cx from 'classnames';
import { LeadFormData } from 'types/LeadFormData';
import { useDepositSubmit } from 'store';
import { LeadForm } from 'containers/Finance/components';
import { useStyles } from './DataSubmit.styles';

interface Props {
  className?: string;
}

const DataSubmit: FC<Props> = ({ className }) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();
  const { loading, submitDeposit } = useDepositSubmit();

  const handleFormSubmit = (data: LeadFormData) => {
    submitDeposit(data);
  };

  return (
    <ContainerWrapper className={cx(s.root, className)}>
      <Box mb={isMobile ? 1.25 : 2.5}>
        <Typography component="h2" variant={isMobile ? 'h4' : 'h2'} align="center">
          Откройте вклад в&nbsp;РГС&nbsp;Банке
        </Typography>
      </Box>
      <Box mb={isMobile ? 2.5 : 3.75}>
        <Typography component="h3" variant={isMobile ? 'h5' : 'h4'} align="center">
          Заполните заявку и наши специалисты свяжутся&nbsp;с&nbsp;вами
        </Typography>
      </Box>
      <LeadForm loading={loading} onSubmit={handleFormSubmit} />
    </ContainerWrapper>
  );
};

export { DataSubmit };
