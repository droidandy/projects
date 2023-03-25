import React, { FC } from 'react';
import { ContainerWrapper, Typography, useBreakpoints, Box } from '@marketplace/ui-kit';
import { LeadFormData } from 'types/LeadFormData';
import { LeadForm } from 'containers/Finance/components';
import { useStyles } from './DataSubmit.styles';

interface Props {
  loading: boolean;
  submitForm: (data: LeadFormData) => void;
}

const DataSubmit: FC<Props> = ({ loading, submitForm }) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();

  const handleFormSubmit = (data: LeadFormData) => {
    submitForm(data);
  };

  return (
    <ContainerWrapper className={s.root}>
      <Box mb={isMobile ? 1.25 : 2.5}>
        <Typography component="h2" variant={isMobile ? 'h4' : 'h2'} align="center">
          Откройте счет в&nbsp;РГС&nbsp;Банке
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
