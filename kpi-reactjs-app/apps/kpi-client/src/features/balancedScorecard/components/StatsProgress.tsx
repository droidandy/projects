import * as React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { getBalancedScorecardState } from '../interface';
import { Colors } from 'src/Const';
import { useQueryFilter } from '../hooks';

interface StatsProgressProps {
  className?: string;
}

const Label = styled.div`
  margin-bottom: 30px;
`;

const Bottom = styled.div`
  display: flex;
  align-items: center;
`;

const ProgressWrapper = styled.div`
  display: flex;
  flex: 1 0 0;
  position: relative;
  height: 5px;
`;

const ProgressBack = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
  background: rgba(0, 0, 0, 0.1);
  height: 5px;
  width: 100%;
  border-radius: 5px;
`;

const ProgressFront = styled(ProgressBack)`
  z-index: 3;
  background: #ffb822;
`;

const Percent = styled.div`
  font-weight: bold;
  font-size: 13px;
  color: #48465b;
  margin-right: 13px;
`;

const _StatsProgress = (props: StatsProgressProps) => {
  const { className } = props;
  const { t } = useTranslation();
  const { scorecards } = getBalancedScorecardState.useState();
  const { scorecardId } = useQueryFilter();
  const scorecard = scorecards.find(x => x.id === scorecardId)!;
  const percent = scorecard.objectPerformance?.performance || 0;
  return (
    <div className={className}>
      <Label>{t('Progress')}</Label>
      <Bottom>
        <ProgressWrapper>
          <ProgressBack />
          <ProgressFront
            style={{
              width: `${percent}%`,
              color:
                Colors[
                  scorecard.objectPerformance?.performanceColor.slug ?? 'gray'
                ],
            }}
          />
        </ProgressWrapper>
        <Percent>{percent}%</Percent>
      </Bottom>
    </div>
  );
};

export const StatsProgress = styled(_StatsProgress)`
  width: 400px;
`;
