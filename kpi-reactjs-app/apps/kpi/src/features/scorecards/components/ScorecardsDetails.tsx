import * as React from 'react';
import styled from 'styled-components';
import { Card } from 'src/components/Card';
import { getScorecardsState, ScorecardsActions } from '../interface';
import { useLanguage } from 'src/hooks/useLanguage';
import { getTrans } from 'src/common/utils';
import { Tab, Tabs } from 'src/components/Tabs';
import { useTranslation } from 'react-i18next';
import { useActions } from 'typeless';
import { InfoTab } from './InfoTab';
import { OverviewTab } from './OverviewTab';
import { ScorecardPeriodPicker } from './ScorecardPeriodPicker';
import { CardTitleNext } from 'src/components/CardTitleNext';
import { EditMeasuresTab } from './EditMeasuresTab';
import { MeasuresTab } from './MeasuresTab';

interface ScorecardsDetailsProps {
  className?: string;
}

const _ScorecardsDetails = (props: ScorecardsDetailsProps) => {
  const { className } = props;
  const {
    scorecard,
    resource,
    selectedTab,
    resourceId,
    isAdding,
  } = getScorecardsState.useState();
  const lang = useLanguage();
  const { t } = useTranslation();
  const { setSelectedTab } = useActions(ScorecardsActions);

  return (
    <Card className={className}>
      <CardTitleNext>
        {getTrans(lang, (resource || scorecard!).name)}
      </CardTitleNext>
      <Tabs
        selectedTab={selectedTab}
        onIndexChange={setSelectedTab}
        append={<ScorecardPeriodPicker />}
      >
        <Tab name="overview" title={t('Overview')}>
          <OverviewTab />
        </Tab>
        <Tab name="measures" title={t('Measures')}>
          <MeasuresTab />
        </Tab>
        <Tab name="alerts" title={t('Alerts')}>
          Alerts
        </Tab>
        <Tab name="history" title={t('History')}>
          History
        </Tab>
        {(resourceId !== null || isAdding) && (
          <Tab name="info" title={t('Info')}>
            <InfoTab />
          </Tab>
        )}
        {selectedTab === 'edit-measures' && (
          <Tab name="edit-measures" title={t('Edit Measures')}>
            <EditMeasuresTab />
          </Tab>
        )}
      </Tabs>
    </Card>
  );
};

export const ScorecardsDetails = styled(_ScorecardsDetails)`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: white;
  overflow: auto;

  ${Tabs} {
    flex: 1 0 0;
    display: flex;
    flex-direction: column;
  }
  ${Tab} {
    flex: 1 0 0;
    height: 100%;
  }
`;
