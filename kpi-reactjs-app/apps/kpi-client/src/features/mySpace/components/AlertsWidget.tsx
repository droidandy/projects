import React from 'react';
import { Card } from './Card';
import { EmptyCardContent } from './EmptyCardContent';
import { NoAlertsImage } from './NoAlertsImage';
import { useTranslation } from 'react-i18next';

export function AlertsWidget() {
  const { t } = useTranslation();

  return (
    <Card title={t('Alerts')}>
      <EmptyCardContent title={t('No Alerts Available Right Now')}>
        <NoAlertsImage />
      </EmptyCardContent>
    </Card>
  );
}
