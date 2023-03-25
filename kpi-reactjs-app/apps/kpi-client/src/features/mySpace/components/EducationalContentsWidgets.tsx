import React from 'react';
import { Card } from './Card';
import { useTranslation } from 'react-i18next';

export function EducationalContentsWidgets() {
  const { t } = useTranslation();

  return <Card title={t('Educational Contents')}>...</Card>;
}
