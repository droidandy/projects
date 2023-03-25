import React from 'react';
import { SaveButtonsWrapper } from 'src/components/SaveButtonsWrapper';
import { Button } from 'src/components/Button';
import { RouterActions } from 'typeless-router';
import { useTranslation } from 'react-i18next';
import { ReportSaveType } from 'src/types-next';
import { useActions } from 'typeless';

interface UnitSaveButtonsProps {
  saveType: ReportSaveType | null;
  isDone: boolean;
  isSaving: boolean;
  save: (type: ReportSaveType) => any;
  type: 'submitter' | 'reviewer';
}

export function UnitSaveButtons(props: UnitSaveButtonsProps) {
  const { t } = useTranslation();
  const { push } = useActions(RouterActions);
  const { type, isSaving, saveType, save, isDone } = props;

  return (
    <SaveButtonsWrapper>
      <div>
        <Button
          styling="brand"
          onClick={() => {
            push('/');
          }}
        >
          {t('Cancel')}
        </Button>
      </div>
      {type === 'submitter' ? (
        <div>
          <Button
            onClick={() => save('submit')}
            loading={isSaving && saveType === 'submit'}
            disabled={isDone}
          >
            {t('submit')}
          </Button>
        </div>
      ) : (
        <div>
          <Button
            onClick={() => save('reject')}
            loading={isSaving && saveType === 'reject'}
            disabled={isDone}
          >
            {t('Need more work')}
          </Button>
          <Button
            onClick={() => save('approve')}
            loading={isSaving && saveType === 'approve'}
            disabled={isDone}
          >
            {t('Approve')}
          </Button>
        </div>
      )}
    </SaveButtonsWrapper>
  );
}
