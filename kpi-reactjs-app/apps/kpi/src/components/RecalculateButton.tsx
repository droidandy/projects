import { useTranslation } from 'react-i18next';
import React from 'react';
import { Button } from './Button';
import { useActions } from 'typeless';
import { GlobalActions, getGlobalState } from 'src/features/global/interface';

export function RecalculateButton() {
  const { t } = useTranslation();
  const { recalculate } = useActions(GlobalActions);
  const { isRecalculating } = getGlobalState.useState();
  return (
    <Button onClick={recalculate} loading={isRecalculating}>
      {t('Recalculate')}
    </Button>
  );
}
