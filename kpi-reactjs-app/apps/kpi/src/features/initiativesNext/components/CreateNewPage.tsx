import * as React from 'react';
import styled from 'styled-components';
import { Button } from 'src/components/Button';
import { useTranslation } from 'react-i18next';
import { Card } from 'src/components/Card';
import { InitiativesActions } from '../interface';
import { useActions } from 'typeless';

interface CreateNewPageProps {
  className?: string;
}

const _CreateNewPage = (props: CreateNewPageProps) => {
  const { className } = props;
  const { t } = useTranslation();
  const { addNewItem } = useActions(InitiativesActions);
  return (
    <Card className={className}>
      <Button onClick={addNewItem}>{t('Create new')}</Button>
    </Card>
  );
};

export const CreateNewPage = styled(_CreateNewPage)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  background: white;
  overflow: auto;
`;
