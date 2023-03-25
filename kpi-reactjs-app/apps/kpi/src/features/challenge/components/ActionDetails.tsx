import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { Button } from 'src/components/Button';
import { useActions } from 'typeless';
import { NoLabelItem } from 'src/components/NoLabelItem';
import { ActionDetailsModal } from 'src/features/actionDetails/components/ActionDetailsView';
import { ActionDetailsActions } from 'src/features/actionDetails/interface';

const AddWrapper = styled.div`
  margin: 15px 0;
  display: flex;
  justify-content: space-between;
`;

export function ActionDetails() {
  const { show } = useActions(ActionDetailsActions);
  const { t } = useTranslation();

  return (
    <NoLabelItem>
      <AddWrapper>
        <span>{t('Suggested actions to be taken by concerned unit')}</span>
        <Button onClick={() => show(null)}>{t('Add Action')}</Button>
      </AddWrapper>
      <ActionDetailsModal />
    </NoLabelItem>
  );
}
