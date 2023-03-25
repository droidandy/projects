import * as React from 'react';
import styled from 'styled-components';
import { Button } from 'src/components/Button';
import { useTranslation } from 'react-i18next';
import {
  getBalancedScorecardState,
  BalancedScorecardActions,
} from '../interface';
import { AddInlineType } from './AddInlineType';
import { Lookup } from 'src/types';
import { useActions } from 'typeless';
import { AddRootItemButton } from './AddRootItemButton';

interface ScorecardHeaderProps {
  className?: string;
}

const Buttons = styled.div`
  display: flex;
  align-items: center;
  font-size: 13px;
  ${Button} {
    margin-right: 10px;
  }
`;

const Header = styled.div`
  background: #066a99;
  color: white;
  border-radius: 3px 3px 0px 0px;
  margin-top: 30px;
  font-weight: bold;
  font-size: 16px;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 52px;
  padding-top: 0;
  padding-bottom: 0;
  padding-left: 10px;
`;

const _ScorecardHeader = (props: ScorecardHeaderProps) => {
  const { t } = useTranslation();
  const { viewMode } = getBalancedScorecardState.useState();
  const { changeViewMode } = useActions(BalancedScorecardActions);
  const [selectedType, setSelectedType] = React.useState<Lookup | null>(null);
  const { className } = props;
  return (
    <>
      <div className={className}>
        <Header>
          {t('Performance').toUpperCase()}
          <Buttons>
            {viewMode === 'tree' && (
              <AddRootItemButton setSelectedType={setSelectedType} />
            )}

            {viewMode === 'tree' ? (
              <Button
                styling="secondary"
                transparent
                onClick={() => changeViewMode('table')}
              >
                + {t('Switch to Table View')}
              </Button>
            ) : (
              <Button
                styling="secondary"
                transparent
                onClick={() => changeViewMode('tree')}
              >
                + {t('Switch to Tree View')}
              </Button>
            )}
          </Buttons>
        </Header>
      </div>
      {selectedType && (
        <AddInlineType
          types={[]}
          preselectedType={selectedType}
          parent={null}
          onDone={() => setSelectedType(null)}
        />
      )}
    </>
  );
};

export const ScorecardHeader = styled(_ScorecardHeader)`
  border-radius: 3px;
  box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.03);
`;
