import { useTranslation } from 'react-i18next';
import React from 'react';
import { Button } from './Button';

export function ResetDataButton({ block }: { block?: boolean }) {
  const { t } = useTranslation();

  return (
    <Button
      block={block}
      onClick={() => {
        for (const key in localStorage) {
          if (key.startsWith('data_')) {
            delete localStorage[key];
            window.location.href = '/';
            window.location.reload();
          }
        }
      }}
    >
      {t('Reset')}
    </Button>
  );
}
