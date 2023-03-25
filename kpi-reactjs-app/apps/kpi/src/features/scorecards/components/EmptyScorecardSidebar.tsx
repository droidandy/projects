import * as React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/Button';
import { Card } from 'src/components/Card';
import { useActions } from 'typeless';
import { CreateScorecardActions } from './CreateScorecardModal';

interface EmptyScorecardSidebarProps {
  className?: string;
}

const _EmptyScorecardSidebar = (props: EmptyScorecardSidebarProps) => {
  const { className } = props;
  const { t } = useTranslation();
  const { show: showCreateScorecard } = useActions(CreateScorecardActions);
  return (
    <Card className={className}>
      <p>
        {t('This unit has no scorecard, click below button to create one.')}
      </p>

      <Button onClick={showCreateScorecard}>{t('Create Scorecard')}</Button>
    </Card>
  );
};

export const EmptyScorecardSidebar = styled(_EmptyScorecardSidebar)`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: white;
  text-align: center;
`;
