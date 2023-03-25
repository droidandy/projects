import * as React from 'react';
import styled from 'styled-components';
import { Card } from 'src/components/Card';
import { CardTitleNext } from 'src/components/CardTitleNext';
import { getInitiativesState, InitiativesActions } from '../interface';
import { useActions, useSelector } from 'typeless';
import { Tabs, Tab } from 'src/components/Tabs';
import { useTranslation } from 'react-i18next';
import { InfoTab } from './InfoTab';
import { getCurrentItemTitle } from '../selectors';
import { OverviewTab } from './OverviewTab';
import { TimelineTab } from './TimelineTab';
import { RiskManagementTab } from './RiskManagementTab';

interface InitiativeDetailsProps {
  className?: string;
}

const _InitiativeDetails = (props: InitiativeDetailsProps) => {
  const { className } = props;
  const { selectedTab, initiative, isAdding } = getInitiativesState.useState();
  const { t } = useTranslation();
  const { setSelectedTab } = useActions(InitiativesActions);
  const title = useSelector(getCurrentItemTitle);
  if (!initiative && !isAdding) {
    return null;
  }
  return (
    <Card className={className}>
      <CardTitleNext>{title}</CardTitleNext>
      <Tabs selectedTab={selectedTab} onIndexChange={setSelectedTab}>
        {!isAdding && (
          <Tab name="overview" title={t('Overview')}>
            <OverviewTab />
          </Tab>
        )}
        {!isAdding && (
          <Tab name="timeline" title={t('Timeline')}>
            <TimelineTab />
          </Tab>
        )}
        <Tab name="info" title={t('Info')}>
          <InfoTab />
        </Tab>
        {!isAdding && (
          <Tab name="riskManagement" title={t('Risk Management')}>
            <RiskManagementTab />
          </Tab>
        )}
      </Tabs>
    </Card>
  );
};

export const InitiativeDetails = styled(_InitiativeDetails)`
  display: block;
  min-height: 100%;
  background: white;
  overflow: auto;
`;
