import * as React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Card } from 'src/components/Card';

interface EmptyScorecardProps {
  className?: string;
}

const _EmptyScorecard = (props: EmptyScorecardProps) => {
  const { className } = props;
  const { t } = useTranslation();
  return <Card className={className}>{t('This Unit has no scorecard.')}</Card>;
};

export const EmptyScorecard = styled(_EmptyScorecard)`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: white;
  text-align: center;
`;
