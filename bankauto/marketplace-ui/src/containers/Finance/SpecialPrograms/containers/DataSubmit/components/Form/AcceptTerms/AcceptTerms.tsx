import React, { FC } from 'react';
import { OmniLink, Typography } from '@marketplace/ui-kit';
import { licenseDocumentsLinksFinance } from 'constants/licenseDocumentsLinks';
import { CheckboxWithErrorMsg } from 'components/Fields';

const AcceptTerms: FC = () => {
  return (
    <CheckboxWithErrorMsg
      name="acceptTerms"
      label={
        <Typography variant="body2">
          Я принимаю{' '}
          <OmniLink href={licenseDocumentsLinksFinance.agreement} rel="noreferrer" target="_blank">
            условия использования
          </OmniLink>{' '}
          сервиса bankauto.ru, подтверждаю{' '}
          <OmniLink href={licenseDocumentsLinksFinance.personalData} rel="noreferrer" target="_blank">
            Согласие на обработку персональных данных{' '}
          </OmniLink>{' '}
          и запрос в БКИ
        </Typography>
      }
    />
  );
};

export { AcceptTerms };
