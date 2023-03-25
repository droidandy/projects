import * as React from 'react';
import * as R from 'remeda';
import styled from 'styled-components';
import { StatsProgress } from './StatsProgress';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { getBalancedScorecardState } from '../interface';
import { BalancedScorecardItemSlug } from 'src/types';
import { StatsItem } from './StatsItem';
import { useTranslation } from 'react-i18next';

interface ScorecardStatsProps {
  className?: string;
}

const Top = styled.div`
  padding-bottom: 30px;
  margin-bottom: 30px;
  border-bottom: 1px solid #f2f3f8;
  display: flex;
  justify-content: space-between;
`;

const DetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 600px;
`;

const Name = styled.div`
  font-weight: 600;
  font-size: 15px;
  line-height: 20px;
  color: #48465b;
`;

const Desc = styled.div`
  margin-top: 5px;
`;

const StatsItems = styled.div`
  display: flex;
  justify-content: space-between;
`;

type StatType = {
  slug: BalancedScorecardItemSlug;
  color: string;
  name: string;
  shortName: string;
};

const statTypes: StatType[] = [
  {
    slug: 'bsi-type-kpi',
    color: '#F3C462',
    name: 'KPIs',
    shortName: 'KP',
  },
  {
    slug: 'bsi-type-objective',
    color: '#FF766C',
    name: 'Objectives',
    shortName: 'OB',
  },
  {
    slug: 'bsi-type-theme',
    color: '#8ED772',
    name: 'Themes',
    shortName: 'TH',
  },
  {
    slug: 'bsi-type-outcome',
    color: '#704B69',
    name: 'Outcomes',
    shortName: 'OT',
  },
  {
    slug: 'bsi-type-enabler',
    color: '#3EDCA0',
    name: 'Enablers',
    shortName: 'EN',
  },
  {
    slug: 'bsi-type-goal',
    color: '#B74817',
    name: 'AD Goals',
    shortName: 'AD',
  },
  {
    slug: 'bsi-type-mofa-goal',
    color: '#9648EF',
    name: 'UAE Goals',
    shortName: 'UA',
  },
  {
    slug: 'bsi-type-development-goal',
    color: '#48A9EF',
    name: 'SD Goals',
    shortName: 'SD',
  },
];
statTypes.reverse();

const _ScorecardStats = (props: ScorecardStatsProps) => {
  const { className } = props;
  const { scorecard } = getBalancedScorecardState.useState();
  const { t } = useTranslation();
  
  const groups = React.useMemo(() => {
    return R.groupBy(scorecard.scorecardItems, x => x.type.slug);
  }, [scorecard]);
  return (
    <div className={className}>
      <Top>
        <DetailsWrapper>
          <Name>
            <DisplayTransString value={scorecard.name} />
          </Name>
          <Desc>
            <DisplayTransString value={scorecard.description} />
          </Desc>
        </DetailsWrapper>
        <StatsProgress />
      </Top>
      <StatsItems>
        {statTypes.map(type => (
          <StatsItem
            key={type.slug}
            color={type.color}
            name={t(type.name)}
            shortName={t(type.shortName)}
            count={groups[type.slug]?.length || 0}
          />
        ))}
      </StatsItems>
    </div>
  );
};

export const ScorecardStats = styled(_ScorecardStats)`
  display: block;
  background: #ffffff;
  box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.03);
  border-radius: 3px;
  padding: 30px;
  margin-top: 30px;
`;
