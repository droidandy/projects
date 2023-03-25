import { useTranslation } from 'react-i18next';
import React from 'react';
import { NoTasksImage } from '../../../components/NoTasksImage';
import { EmptyCardContent } from './EmptyCardContent';
import { Card } from './Card';

export function MyTasksWidget() {
  const { t } = useTranslation();

  return (
    <Card title={t('My Tasks')}>
      <EmptyCardContent title={t('No Tasks Available Right Now')}>
        <NoTasksImage />
      </EmptyCardContent>
    </Card>
  );
}
