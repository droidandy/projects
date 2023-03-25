import * as React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { StickyBottomBar } from 'src/components/StickyBottomBar';
import { Button } from 'src/components/Button';
import { InitiativesActions } from '../interface';
import { useActions } from 'typeless';

interface EditButtonBarProps {
  className?: string;
}

const _EditButtonBar = (props: EditButtonBarProps) => {
  const { t } = useTranslation();
  const { className } = props;
  const { edit } = useActions(InitiativesActions);
  return (
    <StickyBottomBar className={className}>
      <Button styling="brand" onClick={edit}>
        {t('Edit')}
      </Button>
    </StickyBottomBar>
  );
};

export const EditButtonBar = styled(_EditButtonBar)`
  display: block;
`;
