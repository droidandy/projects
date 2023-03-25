import * as React from 'react';
import styled from 'styled-components';
import { rtlMargin } from 'shared/rtl';
import { Button } from 'src/components/Button';
import { useTranslation } from 'react-i18next';
import { StickyBottomBar } from './StickyBottomBar';

interface SaveButtonsNextProps {
  className?: string;
  isSaving: boolean;
  cancelAdd: () => any;
  save: (draft: boolean) => any;
  topMargin?: boolean;
  hideDraft?: boolean;
  saveText?: string;
}

const Left = styled.div`
  ${rtlMargin('0', 'auto')}
`;
const Right = styled.div`
  ${rtlMargin('auto', '0')}
`;

const _SaveButtonsNext = (props: SaveButtonsNextProps) => {
  const { t } = useTranslation();
  const { className, isSaving, cancelAdd, save, hideDraft, saveText } = props;
  return (
    <StickyBottomBar className={className}>
      <Left>
        <Button styling="brand" onClick={cancelAdd}>
          {t('Cancel')}
        </Button>
        {!hideDraft && (
          <Button onClick={() => save(true)}>{t('Save as draft')}</Button>
        )}
      </Left>
      <Right>
        <Button onClick={() => save(false)} loading={isSaving}>
          {t(saveText || 'Save')}
        </Button>
      </Right>
    </StickyBottomBar>
  );
};

export const SaveButtonsNext = styled(_SaveButtonsNext)`
  button + button,
  a + button {
    ${rtlMargin('15px', 0)}
  }
  margin-top: ${props => (props.topMargin ? '20px' : null)};
`;
