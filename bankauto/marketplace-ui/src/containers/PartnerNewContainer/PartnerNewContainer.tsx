import React, { FC, useCallback, useState } from 'react';

import { Typography } from '@material-ui/core';
import { PartnerNewForm } from 'components/PartnerNewForm';
import { Pending } from 'helpers/pendings';
import { FormValidationErrors } from 'types/FormValidationErrors';
import { PartnerNewFormData } from 'types/ParnterNewFormData';
import { ContainerWrapper } from '@marketplace/ui-kit';
import { createPartner } from 'api/partner/createPartner';
import { Partner } from 'types/Partner';
import { useStyles } from './PartnerNewContainer.styles';

const PartnerNewContainer: FC = () => {
  const { root, title } = useStyles();

  const [partnerNewSubmitted, setPartnerNewSubmitted] = useState(false);
  const [partnerNewErrors, setPartnerNewErrors] = useState<FormValidationErrors>({});

  const handleSubmit = useCallback((values: PartnerNewFormData): void => {
    const almostPartner = { ...values };
    delete almostPartner.city;
    const partner: Partner = { cityId: values?.city?.value, ...almostPartner };
    Pending('create-partner', createPartner(partner))
      .then(() => {
        setPartnerNewSubmitted(true);
      })
      .catch(
        ({
          response: {
            data: { detail },
          },
        }) => {
          setPartnerNewErrors(detail);
        },
      );
  }, []);

  return (
    <ContainerWrapper className={root}>
      <Typography variant="h1" className={title}>
        Стать партнером
      </Typography>
      {!partnerNewSubmitted ? (
        <PartnerNewForm validationErrors={partnerNewErrors} handleSubmit={handleSubmit} />
      ) : (
        <Typography variant="body2">Заявка успешно отправлена!</Typography>
      )}
    </ContainerWrapper>
  );
};

export { PartnerNewContainer };
