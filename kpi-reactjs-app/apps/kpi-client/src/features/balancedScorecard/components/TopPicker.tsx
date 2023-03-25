import * as React from 'react';
import styled from 'styled-components';
import { PeriodPicker } from 'src/components/PeriodPicker';
import {
  getBalancedScorecardState,
  BalancedScorecardActions,
} from '../interface';
import { useActions } from 'typeless';
import { useTranslation } from 'react-i18next';
import { Select } from 'src/components/Select';
import { useSelectOptions } from 'src/hooks/useSelectOptions';
import { getRouterState } from 'typeless-router';
import { getQueryFilter } from '../module';
import { useQueryFilter } from '../hooks';

interface TopPickerProps {
  className?: string;
}

const Title = styled.div`
  font-weight: bold;
  font-size: 16px;
  color: #244159;
`;

const Dropdowns = styled.div`
  display: flex;
  z-index: 4;
  & > * {
    min-width: 200px;
  }
  & > * + * {
    margin-right: 10px;
  }
`;

const _TopPicker = (props: TopPickerProps) => {
  const { className } = props;
  const { scorecards } = getBalancedScorecardState.useState();
  const { scorecardId, ...period } = useQueryFilter();
  const { changePeriod, changeScorecard } = useActions(
    BalancedScorecardActions
  );
  const { t } = useTranslation();
  const scorecardOptions = useSelectOptions(scorecards || []);
  return (
    <div className={className}>
      <Title>{t('Scorecard')}</Title>
      <Dropdowns>
        <Select
          isLoading={!scorecards}
          options={scorecardOptions}
          value={scorecardOptions.find(x => x.value === scorecardId)}
          onChange={(option: any) => changeScorecard(option.value)}
        />
        <PeriodPicker
          arrows
          start={new Date().getFullYear() - 5}
          end={new Date().getFullYear()}
          value={period}
          minFrequency="Quarterly"
          onChange={changePeriod}
        />
      </Dropdowns>
    </div>
  );
};

export const TopPicker = styled(_TopPicker)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
`;
